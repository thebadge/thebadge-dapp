import { ReactElement, useCallback } from 'react'

import { Typography } from '@mui/material'
import { constants } from 'ethers'
import { defaultAbiCoder, parseUnits } from 'ethers/lib/utils'
import { useForm } from 'react-hook-form'
import { ErrorOption } from 'react-hook-form/dist/types/errors'
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
  TokenInputSchema,
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
  // challengePeriodDuration: NumberSchema.describe(
  //   'Challenge period duration // During this time the community can analyze the evidence and challenge it.',
  // ),
  // TODO: add rigorousness component. It can be a radio button for now with three options basic, medium, heavy. Later we can migrate to a slider
  // the values for each option should be 1.5, 2 and 3 respectively (check base deposit on how it will impact.)
  rigorousness: SeverityTypeSchema.describe(
    'Rigorousness // How rigorous the emission of badges should be',
  ),
  mintCost: TokenInputSchema.describe(
    'Cost to mint the badge // How much it will be necessary to deposit.',
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
      attributes: JSON.stringify(registration),
      files: ['fileURI', 'metadata.logoURI'],
    })

    const clearingIPFSUploaded = await ipfsUpload({
      attributes: JSON.stringify(clearing),
      files: ['fileURI', 'metadata.logoURI'],
    })

    const badgeTypeIPFSUploaded = await ipfsUpload({
      attributes: JSON.stringify({
        description: data.description,
        image: { mimeType: logoUri?.file.type, base64File: logoUri?.data_url },
        name: name,
      }),
      files: ['image'],
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
          60 * 10, //data.challengePeriodDuration, // challengePeriodDuration:
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
        metadata: `ipfs://${badgeTypeIPFSUploaded.result?.ipfsHash}`, // TODO: should we use a custom one? or the one for TCR is ok?
        controllerName: 'kleros',
        mintCost: parseUnits('0.1', 18),
        mintFee: 0, // TODO: this is a legacy field that is not used in the SC, will be removed in a newer deploy
        validFor: 60 * 10, // data.challengePeriodDuration, // in seconds, 0 infinite
      },
      klerosControllerDataEncoded,
    )
  }
  const form = useForm<z.infer<typeof BadgeTypeCreateSchema>>()
  const { clearErrors, setError } = form

  const triggerTestError = useCallback(
    (error: ErrorOption) => {
      // We need to create this kind of helper function that set the error directly
      // to the form, we need to do it in the parent form component like this.
      setError('mintCost', error)
    },
    [setError],
  )

  const cleanTestError = useCallback(() => {
    // We need to create this kind of helper function that clear the error directly
    // to the form, we need to do it in the parent form component like this.
    clearErrors('mintCost')
  }, [clearErrors])

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h3">
        Please fulfill the form
      </Typography>

      <CustomFormFromSchema
        form={form}
        formProps={{
          useGridLayout: true,
          gridColumns: 3,
          buttonDisabled: !address,
          buttonLabel: address ? 'Register' : 'Connect wallet',
        }}
        onSubmit={onSubmit}
        props={{
          mintCost: {
            decimals: 18,
            maxValue: parseUnits('100', 18),
            setError: triggerTestError,
            cleanError: cleanTestError,
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
