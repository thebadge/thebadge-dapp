import { useRef } from 'react'
import * as React from 'react'

import { Box, Button, Stack, Typography } from '@mui/material'
import domtoimage from 'dom-to-image'
import { useTranslation } from 'next-export-i18n'
import { BadgePreviewV2 } from 'thebadge-ui-library'
import { z } from 'zod'

import { DataGrid } from '@/src/components/form/customForms/type'
import { FormWithSteps } from '@/src/components/form/formWithSteps/FormWithSteps'
import {
  AgreementSchema,
  ChallengePeriodTypeSchema,
  ExpirationTypeSchema,
  FileSchema,
  ImageSchema,
  KlerosDynamicFields,
  LongTextSchema,
  NumberSchema,
  SeverityTypeSchema,
} from '@/src/components/form/helpers/customSchemas'

const MintSchemaStep1 = z.object({
  help: AgreementSchema.describe(`How it works // ??`),
})

const MintSchemaStep2 = z.object({
  name: z.string().describe('name // ??'),
  description: LongTextSchema.describe('description // ??'),
  logoUri: ImageSchema.describe('The logo for your badge type // ??'),
  criteriaFileUri: FileSchema.describe('PDF with the requirements to mint a badge. // ??'),
  challengePeriodDuration: ChallengePeriodTypeSchema.describe(
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
})

const MintSchemaStep3 = z.object({
  badgeMetadataColumns: KlerosDynamicFields.describe(
    'Evidence fields // List of fields that the user will need to provider to be able to mint this badge type.',
  ),
})

export const BadgeTypeCreateSchema = z
  .object({})
  .merge(MintSchemaStep1)
  .merge(MintSchemaStep2)
  .merge(MintSchemaStep3)

type MintStepsProps = {
  onSubmit: (data: z.infer<typeof BadgeTypeCreateSchema>) => void
}

const steps = ['Help', 'Badge type basics', 'Evidence form', 'Badge Type Preview']

const formGridLayout: DataGrid[][] = [
  [{ i: 'AgreementSchema', x: 0, y: 0, w: 12, h: 4, static: true }],
  [
    { i: 'TextField', x: 0, y: 0, w: 3, h: 1, static: true },
    { i: 'TextArea', x: 0, y: 1, w: 3, h: 2, static: true },
    { i: 'ImageInput', x: 3, y: 0, w: 3, h: 3, static: true },
    { i: 'FileInput', x: 2, y: 3, w: 3, h: 3, static: true },
    { i: 'NumberField', x: 0, y: 6, w: 3, h: 1, static: true },
    { i: 'SeveritySelector', x: 3, y: 6, w: 3, h: 1, static: true },
    { i: 'NumberField', x: 0, y: 7, w: 3, h: 1, static: true },
    { i: 'NumberField', x: 3, y: 7, w: 3, h: 1, static: true },
  ],
  [{ i: 'KlerosDynamicFormField', x: 0, y: 0, w: 6, h: 10, static: true }],
]

export default function CreateSteps({ onSubmit }: MintStepsProps) {
  const { t } = useTranslation()
  const badgePreviewRef = useRef<HTMLDivElement>()

  const handleOnSubmit = (data: z.infer<typeof BadgeTypeCreateSchema>) => {
    onSubmit(data)
  }

  const convertPreviewToImage = async () => {
    if (!badgePreviewRef.current) return
    let previewImageDataUrl
    try {
      // Its having and issue with images that has base64 as source
      previewImageDataUrl = await domtoimage.toPng(badgePreviewRef.current, {
        cacheBust: true,
      })
      console.log(previewImageDataUrl)
    } catch (e) {
      console.log(e)
      return
    }
    const link = document.createElement('a')
    link.download = 'my-badge-preview.jpeg'
    link.href = previewImageDataUrl
    link.click()
  }

  function handleFormPreview(data: z.infer<typeof BadgeTypeCreateSchema>) {
    return (
      <Stack alignItems="center" gap={3} margin={4}>
        <Typography>This is how your Badge Type is going to look like</Typography>
        <Box ref={badgePreviewRef}>
          <BadgePreviewV2
            animationEffects={['wobble', 'grow', 'glare']}
            animationOnHover
            badgeBackgroundUrl="https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            badgeUrl="https://www.thebadge.xyz"
            description={data.description}
            imageUrl={data.logoUri.data_url}
            size="medium"
            subline={data.name}
            textContrast="dark-withTextBackground"
            title="Badge Category"
          />
        </Box>

        <Button onClick={convertPreviewToImage}>Convert Preview to Image</Button>
      </Stack>
    )
  }

  return (
    <FormWithSteps
      formFieldProps={[
        {
          help: {
            agreementText: t('badge.type.create.help-steps'),
          },
        },
        {
          mintCost: {
            decimals: 4,
          },
        },
      ]}
      formGridLayout={formGridLayout}
      formLayout={'gridResponsive'}
      formSubmitReview={handleFormPreview}
      onSubmit={handleOnSubmit}
      stepNames={steps}
      stepSchemas={[MintSchemaStep1, MintSchemaStep2, MintSchemaStep3]}
    />
  )
}
