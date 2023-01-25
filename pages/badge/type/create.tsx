import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { constants } from 'ethers'
import { defaultAbiCoder, parseUnits } from 'ethers/lib/utils'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import { CustomFormFromSchema } from '@/src/components/form/CustomForm'
import {
  FileSchema,
  ImageSchema,
  KlerosDynamicFields,
  LongTextSchema,
} from '@/src/components/form/helpers/customSchemas'
import { DefaultLayout } from '@/src/components/layout/BaseLayout'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { generateKlerosListMetaEvidence } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { TheBadge__factory } from '@/types/generated/typechain'

export const BadgeTypeCreateSchema = z.object({
  badgeTypeName: z.string().describe('name // ??'),
  badgeTypeDescription: LongTextSchema.describe('description // ??'),
  badgeTypeLogoUri: ImageSchema.describe('The logo for your badge type // ??'),
  badgeName: z.string().describe('badge name // ??'),
  criteriaFileUri: FileSchema.describe('PDF with the requirements to mint a badge. // ??'),
  numberOfJurors: z
    .number()
    .describe(
      'Number of Jurors // In case arbitration is needed it will determine how many jurors the court will have.',
    ),
  challengePeriodDuration: z
    .number()
    .describe(
      'Challenge period duration // During this time the community can analyze the evidence and challenge it.',
    ),
  badgeMetadataColumns: KlerosDynamicFields.describe(
    'Evidence fields // List of fields that the user will need to provider to be able to mint this badge type.',
  ),
})

const CreateBadgeType: NextPageWithLayout = () => {
  const { address } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const onSubmit = async (data: z.infer<typeof BadgeTypeCreateSchema>) => {
    console.log(data)

    const { clearing, registration } = generateKlerosListMetaEvidence(
      data.badgeName, //badgeName
      { mimeType: data.criteriaFileUri!.file.type, base64File: data.criteriaFileUri!.data_url }, //criteriaFileUri
      data.badgeTypeName, //badgeTypeName
      data.badgeTypeDescription, //badgeTypeDescription
      data.badgeMetadataColumns as any, //badgeMetadataColumns
      { mimeType: data.badgeTypeLogoUri!.file.type, base64File: data.badgeTypeLogoUri!.data_url }, //badgeTypeLogoUri
    )

    console.log(registration)
    const registrationIPFSUploaded = await ipfsUpload({
      attributes: JSON.stringify(registration),
    })

    console.log(clearing)
    const clearingIPFSUploaded = await ipfsUpload({
      attributes: JSON.stringify(clearing),
    })

    const klerosControllerDataEncoded = defaultAbiCoder.encode(
      [
        `tuple(
          address,
          address,
          uint256,
          uint256,
          string,
          string,
          uint256,
          uint256[4],
          uint256[3]
        )`,
      ],
      [
        [
          address as string, // governor
          constants.AddressZero, // admin
          0, // courtId, Fixed for now. Let's use General court
          1, // numberOfJurors:
          `ipfs://${registrationIPFSUploaded.result?.ipfsHash}`, // registration file
          `ipfs://${clearingIPFSUploaded.result?.ipfsHash}`, // clearing file
          10, // challengePeriodDuration:
          [
            0,
            parseUnits('0.01', 18).toString(),
            parseUnits('0.01', 18).toString(),
            parseUnits('0.01', 18).toString(),
          ], // baseDeposits:
          [100, 100, 100], // stakeMultipliers:
        ],
      ],
    )

    return theBadge.createBadgeType(
      {
        metadata: 'ipfs://QmZrfVxGCo3L6qUeg7C1RXqCRDrzMkMeDNXUcBg9Yxrtaa', // TODO: check what info we need to define
        controllerName: 'kleros',
        mintCost: parseUnits('0.1', 18),
        mintFee: parseUnits('0.1', 18),
        validFor: 0, // in seconds, 0 infinite
      },
      klerosControllerDataEncoded,
    )
  }

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h3">
        Please fulfill the form
      </Typography>

      <CustomFormFromSchema
        formProps={{
          buttonDisabled: !address,
          buttonLabel: address ? 'Register' : 'Connect wallet',
        }}
        onSubmit={onSubmit}
        schema={BadgeTypeCreateSchema}
      />
    </>
  )
}

CreateBadgeType.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default CreateBadgeType
