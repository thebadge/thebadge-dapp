import { useRouter } from 'next/router'
import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { BigNumber } from 'ethers'
import { defaultAbiCoder, formatUnits } from 'ethers/lib/utils'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import { CustomFormFromSchema } from '@/src/components/form/customForms/CustomForm'
import { FileSchema } from '@/src/components/form/helpers/customSchemas'
import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import ipfsUpload from '@/src/utils/ipfsUpload'
import {
  KlerosBadgeTypeController,
  KlerosBadgeTypeController__factory,
} from '@/types/generated/typechain'
import { KLEROS_LIST_TYPES } from '@/types/kleros/types'

const getKlerosFieldByString = ({
  description,
  label,
  type,
}: {
  description: string
  label: string
  type: string
}) =>
  // isIdentifier: boolean, // TODO: fix, is not being saved on the IPFS file of metadata.
  {
    const values = Object.values(KLEROS_LIST_TYPES)
    if (!values.includes(type as KLEROS_LIST_TYPES)) {
      throw `Type ${type} is not part of KLEROS_LIST_TYPES.`
    }

    return {
      label,
      description,
      type: type as KLEROS_LIST_TYPES,
      // isIdentifier: isIdentifier,
    }
  }

const MintBadgeType: NextPageWithLayout = () => {
  const { appChainId } = useWeb3Connection()

  const router = useRouter()
  const badgeTypeId = router.query.typeId as string
  if (!badgeTypeId || typeof badgeTypeId != 'string') {
    throw `No typeId provided us URL query param`
  }

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeType = gql.useBadgeType({ id: badgeTypeId })

  // TODO: hardcoded for now, as we only support Kleros.
  const badgeTypeMetadata = useS3Metadata(
    badgeType.data?.badgeType?.klerosBadge?.klerosMetadataURL || '',
  )
  if (badgeTypeMetadata.error) {
    throw `There was an error trying to fetch the metadata for the badge type`
  }

  // badgeRequestValue
  const klerosController = useContractInstance(
    KlerosBadgeTypeController__factory,
    'KlerosBadgeTypeController',
  )
  const calls = [klerosController.badgeRequestValue] as const
  const [{ data: klerosDepositCostData }] = useContractCall<
    KlerosBadgeTypeController,
    typeof calls
  >(calls, [[badgeTypeId]], `klerosBadgeRequestValue-${badgeTypeId}`)

  console.log(badgeTypeMetadata.data.file.metadata.columns)

  const CreateBadgeSchema = z.object({
    evidenceFileUri: FileSchema.describe(
      'Evidence // PDF with the evidence required to mint a badge.',
    ),
    ...klerosSchemaFactory([]),
  })

  async function onSubmit(data: z.infer<typeof CreateBadgeSchema>) {
    const evidenceIPFSUploaded = await ipfsUpload({
      attributes: { evidence: data.evidenceFileUri },
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
  }

  const mintCost = BigNumber.from(badgeType.data?.badgeType?.mintCost || 0)
  const klerosCost = klerosDepositCostData?.[0] || ZERO_BN

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.black} variant="h5">
        <div>Mint cost: {formatUnits(mintCost, 18)}.</div>
        <div>
          Deposit for kleros: {formatUnits(klerosCost, 18)}. (This will be returned if the evidence
          is veridic)
        </div>
        <div>Total (Native token) need: {formatUnits(mintCost.add(klerosCost), 18)}</div>
      </Typography>

      <CustomFormFromSchema onSubmit={onSubmit} schema={CreateBadgeSchema} />
    </>
  )
}

MintBadgeType.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default withGenericSuspense(MintBadgeType)
