import { ReactElement } from 'react'

import { Typography } from '@mui/material'
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
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateKlerosListMetaEvidence } from '@/src/utils/kleros/generateKlerosListMetaEvidence'

export const BadgeTypeCreateSchema = z.object({
  badgeTypeName: z.string().describe('Enter the name of this badge type // ??'),
  badgeTypeDescription: LongTextSchema.describe('Enter a description for your badge type // ??'),
  badgeName: z.string().describe('How are the badges users will mint be called? // ??'),
  badgeNamePlural: z
    .string()
    .describe('How are the badges users will mint be called for plural? // ??'),
  criteriaFileUri: FileSchema.describe(
    'Upload a PDF file that describes the requirements to mint a badge. // ??',
  ),
  listLogoUri: ImageSchema.describe(
    'Upload a logo for your badge type, this logo will be used each time a user mints a badge. // ??',
  ),
  listItemInfo: KlerosDynamicFields.describe(
    'Evidence fields // List of fields that the user will need to provider to be able to mint this badge type.',
  ),
})

const CreateBadgeType: NextPageWithLayout = () => {
  const { address } = useWeb3Connection()

  const onSubmit = (data: z.infer<typeof BadgeTypeCreateSchema>) => {
    const { clearing, registration } = generateKlerosListMetaEvidence(
      'Github', // itemName: string,
      'Github', // itemNamePlural: string,
      'ipfs://QmXTYGaV23KCGN4PxP6R9GvTsyU4gi9X2ymarL2M1k1vju', // criteriaFileUri, this file is used to describe the requirements to mint a badge
      'Github', //listName: string,
      'Github badge types allows a Github user to claim ownership of a Github account', //listDescription: string,
      [], // listItemInfo: MetadataColumn[],
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', // listLogoUri: string, upload logo provided to the user to IPFS and use that hash
      true, // requireRemovalEvidence: boolean,
      true, // relTcrDisabled: boolean, // research about it
    )

    console.log(data)
    console.log(clearing)
    console.log(registration)
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
