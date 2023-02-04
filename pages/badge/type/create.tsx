import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { constants } from 'ethers'
import { defaultAbiCoder, parseUnits } from 'ethers/lib/utils'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import { CustomFormFromSchema } from '@/src/components/form/customForms/CustomForm'
import {
  ExpirationTypeSchema,
  FileSchema,
  ImageSchema,
  KlerosDynamicFields,
  LongTextSchema,
  NumberSchema,
  SeverityTypeSchema,
} from '@/src/components/form/helpers/customSchemas'
import { isMetadataColumnArray } from '@/src/components/form/helpers/validators'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import { contracts } from '@/src/contracts/contracts'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { generateKlerosListMetaEvidence } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { Kleros__factory, TheBadge__factory } from '@/types/generated/typechain'
import { Severity } from '@/types/utils'

export const BadgeTypeCreateSchema = z.object({
  name: z.string().describe('name // ??'),
  description: LongTextSchema.describe('description // ??'),
  logoUri: ImageSchema.describe('The logo for your badge type // ??'),
  criteriaFileUri: FileSchema.describe('PDF with the requirements to mint a badge. // ??'),
  challengePeriodDuration: NumberSchema.describe(
    'Challenge period duration // Challenge period duration in days. During this time the community can analyze the evidence and challenge it.',
  ),
  rigorousness: SeverityTypeSchema.describe(
    'Rigorousness // How rigorous the emission of badges should be',
  ),
  mintCost: NumberSchema.describe(
    'Cost to mint in ETH // How much it will be necessary to deposit.',
  ),
  validFor: ExpirationTypeSchema.describe(
    'Expiration time // The badge will valid for this amount of  (0 is forever)',
  ),
  badgeMetadataColumns: KlerosDynamicFields.describe(
    'Evidence fields // List of fields that the user will need to provider to be able to mint this badge type.',
  ),
})

const CreateBadgeType: NextPageWithLayout = () => {
  const { address, appChainId, readOnlyAppProvider } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const onSubmit = async (data: z.infer<typeof BadgeTypeCreateSchema>) => {
    const { badgeMetadataColumns, criteriaFileUri, description, logoUri, name } = data

    // Safe-ward to infer MetadataColumn[], It will never go throw the return
    if (!isMetadataColumnArray(badgeMetadataColumns)) return

    const { clearing, registration } = generateKlerosListMetaEvidence(
      name, //badgeName
      {
        fileName: 'fileURI',
        mimeType: criteriaFileUri?.file.type,
        base64File: criteriaFileUri?.data_url,
      }, //criteriaFileUri
      name, //badgeTypeName
      description, //badgeTypeDescription
      badgeMetadataColumns, //badgeMetadataColumns
      { fileName: 'logoURI', mimeType: logoUri?.file.type, base64File: logoUri?.data_url }, //badgeTypeLogoUri
    )
    const registrationIPFSUploaded = await ipfsUpload({
      attributes: registration,
      filePaths: ['fileURI', 'metadata.logoURI'],
    })

    const clearingIPFSUploaded = await ipfsUpload({
      attributes: clearing,
      filePaths: ['fileURI', 'metadata.logoURI'],
    })

    const badgeTypeIPFSUploaded = await ipfsUpload({
      attributes: {
        description: data.description,
        image: { mimeType: logoUri?.file.type, base64File: logoUri?.data_url },
        name: name,
      },
      filePaths: ['image'],
    })

    const kleros = Kleros__factory.connect(
      contracts.Kleros.address[appChainId],
      readOnlyAppProvider,
    )
    const numberOfJurors = Severity[data.rigorousness as keyof typeof Severity]
    const klerosCourtInfo = await kleros.courts(0) // TODO: fixed for now
    const baseDeposit = klerosCourtInfo.feeForJuror.mul(numberOfJurors)

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
          numberOfJurors, // numberOfJurors:
          `ipfs://${registrationIPFSUploaded.result?.ipfsHash}`, // registration file
          `ipfs://${clearingIPFSUploaded.result?.ipfsHash}`, // clearing file
          data.challengePeriodDuration * 24 * 60 * 60, // challengePeriodDuration:
          [
            baseDeposit.add(klerosCourtInfo.feeForJuror.mul(numberOfJurors)).toString(), // jurors * fee per juror + rigorousness
            baseDeposit.add(klerosCourtInfo.feeForJuror.mul(numberOfJurors)).toString(), // The base deposit to remove an item.
            baseDeposit.div(2).toString(), // The base deposit to challenge a submission.
            baseDeposit.div(4).toString(), // The base deposit to challenge a removal request.
          ], // baseDeposits:
          [100, 100, 100], // stakeMultipliers:
        ],
      ],
    )

    return theBadge.createBadgeType(
      {
        metadata: `ipfs://${badgeTypeIPFSUploaded.result?.ipfsHash}`, // TODO: should we use a custom one? or the one for TCR is ok?
        controllerName: 'kleros',
        mintCost: parseUnits(data.mintCost.toString(), 18),
        mintFee: 0, // TODO: this is a legacy field that is not used in the SC, will be removed in a newer deploy
        validFor: data.validFor, // data.challengePeriodDuration, // in seconds, 0 infinite
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
          useGridLayout: true,
          gridColumns: 3,
          buttonDisabled: !address,
          buttonLabel: address ? 'Register' : 'Connect wallet',
        }}
        onSubmit={onSubmit}
        props={{
          mintCost: {
            decimals: 4,
          },
        }}
        schema={BadgeTypeCreateSchema}
      />
    </>
  )
}

CreateBadgeType.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default CreateBadgeType
