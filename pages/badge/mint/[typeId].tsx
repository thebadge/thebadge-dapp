import { useRouter } from 'next/router'

import { Stack, Typography } from '@mui/material'
import { BigNumber } from 'ethers'
import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useS3Metadata from '@/src/hooks/useS3Metadata'
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

  const badgeTypeId = router.query.typeId as string
  if (!badgeTypeId) {
    throw `No typeId provided us URL query param`
  }

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeType = gql.useBadgeType({ id: badgeTypeId })

  // TODO: hardcoded for now, as we only support Kleros.
  // Get columns required for the form to upload evidence.
  const badgeTypeMetadata = useS3Metadata<{ content: KlerosListStructure }>(
    badgeType.data?.badgeType?.klerosBadge?.klerosMetadataURL || '',
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

    return theBadge.requestBadge(badgeTypeId, address as string, klerosControllerDataEncoded, {
      value: totalMintCost,
    })
  }

  const badgeMetadata = badgeTypeMetadata.data.content
  const badgeName = badgeMetadata.name

  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={colors.green} textAlign="center" variant="title2">
          {t('badge.type.mint.title', { badgeName })}
        </Typography>

        <Typography textAlign="justify" variant="body4" width="85%">
          {t('badge.type.mint.sub-title')}
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
      />
    </>
  )
}

export default withPageGenericSuspense(MintBadgeType)
