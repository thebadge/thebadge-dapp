import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { Stack, Typography } from '@mui/material'
import { BigNumber } from 'ethers'
import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintSteps from '@/src/pagePartials/badge/mint/MintSteps'
import useKlerosDepositPrice from '@/src/pagePartials/badge/useKlerosDepositPrice'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { TheBadge__factory } from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const MintBadgeType: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { address, appChainId } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  const router = useRouter()
  const { sendTx, state } = useTransaction()

  const badgeTypeId = router.query.typeId as string
  if (!badgeTypeId) {
    throw `No typeId provided us URL query param`
  }

  useEffect(() => {
    // Redirect to the profile
    if (state === TransactionStates.success) {
      router.push(`/profile?filter=badgesInReview`)
    }
  }, [router, state])

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeType = gql.useBadgeType({ id: badgeTypeId })

  // TODO: hardcoded for now, as we only support Kleros.
  // Get columns required for the form to upload evidence.
  const badgeTypeMetadata = useS3Metadata<{ content: KlerosListStructure }>(
    badgeType.data?.badgeType?.klerosBadge?.klerosMetadataURL || '',
  )
  // TODO Add Creator type
  const badgeCreatorMetadata = useS3Metadata<{ content: any }>(
    badgeType.data?.badgeType?.creator.creatorMetadata || '',
  )

  if (badgeTypeMetadata.error || !badgeTypeMetadata.data) {
    throw `There was an error trying to fetch the metadata for the badge type`
  }

  // Get kleros deposit value for the badge type
  const klerosCost = useKlerosDepositPrice(badgeTypeId)
  if (!klerosCost) {
    throw `There was not possible to get Kleros deposit price for badge type ${badgeTypeId}`
  }

  const mintCost = BigNumber.from(badgeType.data?.badgeType?.mintCost || 0)
  const totalMintCost = mintCost.add(klerosCost)

  const CreateBadgeSchema = z.object(
    klerosSchemaFactory(badgeTypeMetadata.data.content.metadata.columns),
  )

  async function onSubmit(data: z.infer<typeof CreateBadgeSchema>, imageDataUrl: string) {
    const values: Record<string, unknown> = {}
    Object.keys(data).forEach((key) => (values[key] = data[key]))

    const evidenceIPFSUploaded = await ipfsUpload({
      attributes: {
        columns: badgeTypeMetadata.data?.content.metadata.columns,
        image: { mimeType: 'image/png', base64File: imageDataUrl },
        values,
      },
      filePaths: ['image'],
    })

    const klerosControllerDataEncoded = defaultAbiCoder.encode(
      [`tuple(string)`],
      [
        [
          `ipfs://${evidenceIPFSUploaded.result?.ipfsHash}`, // evidence
        ],
      ],
    )

    try {
      const transaction = await sendTx(() =>
        theBadge.requestBadge(badgeTypeId, address as string, klerosControllerDataEncoded, {
          value: totalMintCost,
        }),
      )

      await transaction.wait()
    } catch (e) {
      // Do nothing
    }
  }

  const creator = badgeCreatorMetadata.data?.content
  const badgeMetadata = badgeTypeMetadata.data.content
  const badgeName = badgeMetadata.name

  // 👇	ReactMarkdown needs to have the children as a prop
  /* eslint-disable react/no-children-prop */
  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={colors.green} textAlign="center" variant="title2">
          {t('badge.type.mint.title')}
        </Typography>

        <Typography component="div" textAlign="justify" variant="body3" width="85%">
          {/* ReactMarkdown want it in this way  */}
          <ReactMarkdown
            children={t('badge.type.mint.sub-title', {
              badgeName,
              creatorContact: `(${creator.email})`,
            })}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank">
                  here
                </a>
              ),
            }}
            remarkPlugins={[remarkGfm]}
          />
        </Typography>
      </Stack>

      <MintSteps
        badgeMetadata={badgeMetadata}
        costs={{
          mintCost: formatUnits(mintCost, 18),
          totalMintCost: formatUnits(totalMintCost, 18),
          klerosCost: formatUnits(klerosCost, 18),
        }}
        evidenceSchema={CreateBadgeSchema}
        onSubmit={onSubmit}
        txState={state}
      />
    </>
  )
}

export default withPageGenericSuspense(MintBadgeType)
