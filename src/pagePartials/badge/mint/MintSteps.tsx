import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { BadgePreviewV2 } from 'thebadge-ui-library'
import { AnyZodObject, z } from 'zod'

import { DataGrid } from '@/src/components/form/customForms/type'
import { FormWithSteps } from '@/src/components/form/formWithSteps/FormWithSteps'
import { AgreementSchema } from '@/src/components/form/helpers/customSchemas'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { BackendFileUpload } from '@/types/utils'

// eslint-disable-next-line @typescript-eslint/ban-types
type MintStepsProps<SchemaType extends z.ZodEffects<any, any, any> | AnyZodObject = any> = {
  onSubmit: (data: z.TypeOf<SchemaType>) => void
  evidenceSchema: SchemaType
  logoUri: string | BackendFileUpload
  costs: {
    mintCost: string
    klerosCost: string
    totalMintCost: string
  }
}

const steps = ['Help', 'Evidence form', 'Badge Preview']

const formGridLayout: DataGrid[][] = [
  [{ i: 'AgreementSchema', x: 0, y: 0, w: 12, h: 6, static: true }],
  [],
]

export const MintSchemaStep1 = z.object({
  help: AgreementSchema.describe(`How it works // ??`),
})

export default function MintSteps({ costs, evidenceSchema, logoUri, onSubmit }: MintStepsProps) {
  const { t } = useTranslation()
  const badgeLogoData = useS3Metadata<{ s3Url: string }>(logoUri as string)
  const badgeLogoUrl = badgeLogoData.data?.s3Url

  const handleOnSubmit = (data: z.infer<typeof evidenceSchema>) => {
    onSubmit(data)
  }

  function handleFormPreview(data: z.infer<typeof evidenceSchema>) {
    return (
      <Stack alignItems={'center'} gap={2} margin={1}>
        <Typography variant="h5">
          <div>Mint cost: {costs.mintCost}.</div>
          <div>
            Deposit for Kleros: {costs.klerosCost}. (This will be returned if the evidence is valid)
          </div>
          <div>Total (Native token) need: {costs.totalMintCost}</div>
        </Typography>
        <Typography>This is how you Badge is going to look like</Typography>
        <BadgePreviewV2
          animationEffects={['wobble', 'grow', 'glare']}
          animationOnHover
          badgeBackgroundUrl="https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
          badgeUrl="https://www.thebadge.xyz"
          description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          imageUrl={badgeLogoUrl}
          size="medium"
          subline="Subline Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          textContrast="dark-withTextBackground"
          title="TITLE xxx Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        />
      </Stack>
    )
  }

  return (
    <FormWithSteps
      formFieldProps={[
        {
          help: {
            agreementText: t('badge.type.mint.help-steps'),
          },
        },
      ]}
      formGridLayout={formGridLayout}
      formLayout={'gridResponsive'}
      formSubmitReview={handleFormPreview}
      onSubmit={handleOnSubmit}
      stepNames={steps}
      stepSchemas={[MintSchemaStep1, evidenceSchema]}
    />
  )
}
