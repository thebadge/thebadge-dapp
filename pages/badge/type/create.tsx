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

export const BadgeTypeCreateSchema = z.object({
  badgeTypeName: z.string().describe('name // ??'),
  badgeTypeDescription: LongTextSchema.describe('description // ??'),
  badgeTypeLogoUri: ImageSchema.describe('The logo for your badge type // ??'),
  badgeName: z.string().describe('badge name // ??'),
  criteriaFileUri: FileSchema.describe('PDF with the requirements to mint a badge. // ??'),
  numberOfJurors: NumberSchema.describe(
    'Number of Jurors // In case arbitration is needed it will determine how many jurors the court will have.',
  ),
  challengePeriodDuration: NumberSchema.describe(
    'Challenge period duration // During this time the community can analyze the evidence and challenge it.',
  ),
  // TODO: add rigorousness component. It can be a radio button for now with three options basic, medium, heavy. Later we can migrate to a slider
  // the values for each option should be 1.5, 2 and 3 respectively (check base deposit on how it will impact.)
  rigorousness: SeverityTypeSchema.describe(
    'Rigorousness // How rigorous the emission of badges should be',
  ),
  badgeMetadataColumns: KlerosDynamicFields.describe(
    'Evidence fields // List of fields that the user will need to provider to be able to mint this badge type.',
  ),
})

const CreateBadgeType: NextPageWithLayout = () => {
  const { address, appChainId, readOnlyAppProvider } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const onSubmit = async (data: z.infer<typeof BadgeTypeCreateSchema>) => {
    console.log(data)
    const {
      badgeMetadataColumns,
      badgeName,
      badgeTypeDescription,
      badgeTypeLogoUri,
      badgeTypeName,
      criteriaFileUri,
    } = data

    // Safe-ward to infer MetadataColumn[], It will never go throw the return
    if (!isMetadataColumnArray(badgeMetadataColumns)) return

    const { clearing, registration } = generateKlerosListMetaEvidence(
      badgeName, //badgeName
      { mimeType: criteriaFileUri?.file.type, base64File: criteriaFileUri?.data_url }, //criteriaFileUri
      badgeTypeName, //badgeTypeName
      badgeTypeDescription, //badgeTypeDescription
      badgeMetadataColumns, //badgeMetadataColumns
      { mimeType: badgeTypeLogoUri?.file.type, base64File: badgeTypeLogoUri?.data_url }, //badgeTypeLogoUri
    )

    console.log(registration)
    const registrationIPFSUploaded = await ipfsUpload({
      attributes: JSON.stringify(registration),
    })

    console.log(clearing)
    const clearingIPFSUploaded = await ipfsUpload({
      attributes: JSON.stringify(clearing),
    })

    const kleros = Kleros__factory.connect(
      contracts.Kleros.address[appChainId],
      readOnlyAppProvider,
    )
    const klerosCourtInfo = await kleros.courts(0)
    const baseDeposit = klerosCourtInfo.feeForJuror.mul(data.numberOfJurors)

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
          data.numberOfJurors, // numberOfJurors:
          `ipfs://${registrationIPFSUploaded.result?.ipfsHash}`, // registration file
          `ipfs://${clearingIPFSUploaded.result?.ipfsHash}`, // clearing file
          data.challengePeriodDuration, // challengePeriodDuration:
          [
            baseDeposit.add(klerosCourtInfo.feeForJuror.mul(data.rigorousness)).toString(), // jurors * fee per juror + rigorousness
            baseDeposit.add(klerosCourtInfo.feeForJuror.mul(data.rigorousness)).toString(), // The base deposit to remove an item.
            baseDeposit.div(2).toString(), // The base deposit to challenge a submission.
            baseDeposit.div(4).toString(), // The base deposit to challenge a removal request.
          ], // baseDeposits:
          [100, 100, 100], // stakeMultipliers:
        ],
      ],
    )

    return theBadge.createBadgeType(
      {
        metadata: 'ipfs://QmZrfVxGCo3L6qUeg7C1RXqCRDrzMkMeDNXUcBg9Yxrtaa', // TODO: should we use a custom one? or the one for TCR is ok?
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
