import { useRouter } from 'next/router'
import { ReactElement } from 'react'

import { Stack, Typography } from '@mui/material'
import { BigNumber } from 'ethers'
import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { CustomFormFromSchema } from '@/src/components/form/customForms/CustomForm'
import { FileSchema } from '@/src/components/form/helpers/customSchemas'
import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import { pageWithGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import DefaultLayout from '@/src/components/layout/DefaultLayout'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { klerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import {
  KlerosBadgeTypeController,
  KlerosBadgeTypeController__factory,
  TheBadge__factory,
} from '@/types/generated/typechain'
import { NextPageWithLayout } from '@/types/next'

const MintBadgeType: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { address, appChainId } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const router = useRouter()
  const badgeTypeId = router.query.typeId as string
  if (!badgeTypeId || typeof badgeTypeId != 'string') {
    throw `No typeId provided us URL query param`
  }

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeType = gql.useBadgeType({ id: badgeTypeId })

  // TODO: hardcoded for now, as we only support Kleros.
  const badgeTypeMetadata = useS3Metadata<{ file: klerosListStructure }>(
    badgeType.data?.badgeType?.klerosBadge?.klerosMetadataURL || '',
  )
  if (badgeTypeMetadata.error || !badgeTypeMetadata.data) {
    throw `There was an error trying to fetch the metadata for the badge type`
  }

  const CreateBadgeSchema = z.object({
    evidenceFileUri: FileSchema.describe(
      'Evidence // PDF with the evidence required to mint a badge.',
    ),
    ...klerosSchemaFactory(badgeTypeMetadata.data.file.metadata.columns),
  })

  const klerosController = useContractInstance(
    KlerosBadgeTypeController__factory,
    'KlerosBadgeTypeController',
  )
  const calls = [klerosController.badgeRequestValue] as const

  const [{ data: klerosDepositCostData }] = useContractCall<
    KlerosBadgeTypeController,
    typeof calls
  >(calls, [[badgeTypeId]], `klerosBadgeRequestValue-${badgeTypeId}`)

  const klerosCost = klerosDepositCostData?.[0] || ZERO_BN
  const mintCostBN = BigNumber.from(badgeType.data?.badgeType?.mintCost || 0)
  const totalMintCost = mintCostBN.add(klerosCost)

  async function onSubmit(data: z.infer<typeof CreateBadgeSchema>) {
    const evidenceIPFSUploaded = await ipfsUpload({
      attributes: {
        evidence: {
          mimeType: data.evidenceFileUri?.file.type,
          base64File: data.evidenceFileUri?.data_url,
        },
      },
      filePaths: ['evidence'],
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

  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={colors.green} textAlign="center" variant="title2">
          {t('badge.type.mint.title')}
        </Typography>

        <Typography textAlign="justify" variant="body4" width="85%">
          {t('badge.type.mint.sub-title')}
        </Typography>
      </Stack>

      <Typography color={colors.white} variant="h5">
        <div>Mint cost: {formatUnits(mintCostBN, 18)}.</div>
        <div>
          Deposit for kleros: {formatUnits(klerosCost, 18)}. (This will be returned if the evidence
          is veridic)
        </div>
        <div>Total (Native token) need: {formatUnits(totalMintCost, 18)}</div>
      </Typography>

      <CustomFormFromSchema onSubmit={onSubmit} schema={CreateBadgeSchema} />
    </>
  )
}

MintBadgeType.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default pageWithGenericSuspense(MintBadgeType)
