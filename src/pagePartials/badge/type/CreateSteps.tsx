import * as React from 'react'
import { useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { BadgePreview, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { z } from 'zod'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
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
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import { APP_URL, DISCORD_URL, DOCS_URL, IS_DEVELOP } from '@/src/constants/common'
import { TransactionStates } from '@/src/hooks/useTransaction'

const MintSchemaStep1 = z.object({
  help: AgreementSchema.describe(`Badge creation quick tutorial.`),
})

const MintSchemaStep2 = z.object({
  name: z.string().describe('Name // This is the name that your badge type will have'),
  description: LongTextSchema.describe(
    'Description // This description will be showed on the Badge itself, you can use some helpers to inject user information on it.',
  ),
  badgeModelLogoUri: ImageSchema.describe(
    'Your badge type logo // This Logo will be on the center part of the Badge itself. Recommended images with aspect ratio of 1.',
  ),
  criteriaFileUri: FileSchema.describe(
    'Curation criteria (PDF format). // This is the document containing your badge curation criteria, an example of curation criteria can be found on the docs.',
  ),
  challengePeriodDuration: ChallengePeriodTypeSchema.describe(
    `Challenge period duration (${
      IS_DEVELOP ? 'minutes' : 'days'
    }) // Challenge period duration in days. During this time the community can analyze the evidence and challenge it.`,
  ),
  rigorousness: SeverityTypeSchema.describe(
    'Rigorousness // How rigorous the emission of badges should be',
  ),
  mintCost: NumberSchema.describe(
    'Cost to mint in ETH // How much it will be necessary to deposit.',
  ),
  validFor: ExpirationTypeSchema.describe(
    'Expiration time // The badge will be valid for this amount of time (0 is forever)',
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
  txState: TransactionStates
}

const steps = ['Help', 'Badge type basics', 'Evidence form', 'Badge Type Preview']

const formGridLayout: DataGrid[][] = [
  [{ i: 'AgreementSchema', x: 0, y: 0, w: 12, h: 7, static: true }],
  [
    { i: 'TextField', x: 0, y: 0, w: 3, h: 1, static: true },
    { i: 'DescriptionTextSchema', x: 0, y: 1.5, w: 3, h: 2.5, static: true },
    { i: 'ImageInput', x: 4, y: 0, w: 3, h: 3.5, static: true },
    { i: 'FileInput', x: 0, y: 5, w: 7.5, h: 1, static: true },
    { i: 'NumberField', x: 0, y: 6.5, w: 3, h: 1, static: true },
    { i: 'SeveritySelector', x: 4, y: 6.5, w: 3, h: 1, static: true },
    { i: 'NumberField', x: 0, y: 7, w: 3, h: 1, static: true },
    { i: 'NumberField', x: 4, y: 7, w: 3, h: 1, static: true },
  ],
  [{ i: 'KlerosDynamicFormField', x: 0, y: 0, w: 6, h: 10, static: true }],
]

export default function CreateSteps({ onSubmit, txState }: MintStepsProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)

  const handleOnSubmit = (data: z.infer<typeof BadgeTypeCreateSchema>) => {
    onSubmit(data)
  }

  function handleFormPreview(data: z.infer<typeof BadgeTypeCreateSchema>) {
    if (txState !== TransactionStates.none) {
      return <TransactionLoading state={txState} />
    }

    return (
      <Stack alignItems="center" gap={3} margin={4}>
        <Typography>{t('badge.type.create.previewTitle')}</Typography>
        <BadgePreview
          animationEffects={['wobble', 'grow', 'glare']}
          animationOnHover
          badgeBackgroundUrl="https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
          badgeUrl={APP_URL}
          category={data.name}
          description={data.description}
          imageUrl={data.badgeModelLogoUri.base64File}
          size="medium"
          textContrast="light-withTextBackground"
          title={data.name}
        />
      </Stack>
    )
  }

  return (
    <>
      <Stack sx={{ display: 'flex', flexDirection: 'column', mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={colors.purple} textAlign="center" variant="title2">
          {t('badge.type.create.title')}
        </Typography>

        <MarkdownTypography textAlign="justify" variant="body3" width="85%">
          {t(`badge.type.create.steps.${currentStep}.subTitle`, {
            docsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
            criteriaDocsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
            createBadgeTypeDocs:
              DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
          })}
        </MarkdownTypography>
      </Stack>

      <FormWithSteps
        formFieldProps={[
          {
            help: {
              agreementText: t('badge.type.create.helpSteps', {
                curationCriteriaDocsUrl:
                  DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
                curationCriteriaStandardDocsUrl:
                  DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
                termsUrls: '/terms',
                docsUrl: DOCS_URL,
                discordUrl: DISCORD_URL,
              }),
            },
          },
          {
            mintCost: {
              decimals: 4,
            },
            description: {
              rows: 4,
            },
          },
        ]}
        formGridLayout={formGridLayout}
        formLayout={['flex', 'flex', 'flex', 'gridResponsive']}
        formSubmitReview={handleFormPreview}
        hideSubmit={txState !== TransactionStates.none}
        onStepChanged={(sn) => setCurrentStep(sn)}
        onSubmit={handleOnSubmit}
        stepNames={steps}
        stepSchemas={[MintSchemaStep1, MintSchemaStep2, MintSchemaStep3]}
      />
    </>
  )
}
