import * as React from 'react'
import { useCallback, useState } from 'react'

import { Avatar, Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { RegisterCuratorSchema } from '@/pages/creator/register'
import { DataGrid } from '@/src/components/form/customForms/type'
import { FormWithSteps } from '@/src/components/form/formWithSteps/FormWithSteps'
import {
  AgreementSchema,
  AvatarSchema,
  EmailSchema,
  LongTextSchema,
  TwitterSchema,
} from '@/src/components/form/helpers/customSchemas'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import { TransactionStates } from '@/src/hooks/useTransaction'

type RegistrationStepsProps = {
  txState: TransactionStates

  onSubmit: (data: z.infer<typeof RegisterCuratorSchema>) => void
}

const steps = ['Account details.', 'Contact information.', 'Terms and conditions.']

const formGridLayout: DataGrid[][] = [
  [
    { i: 'TextField', x: 0, y: 0, w: 3, h: 1, static: true },
    { i: 'TextArea', x: 0, y: 1, w: 3, h: 2, static: true },
    { i: 'AvatarInput', x: 4, y: 0, w: 3, h: 3, static: true },
  ],
  [
    { i: 'TextField', x: 0, y: 1, w: 3, h: 1, static: true },
    { i: 'TextField', x: 4, y: 1, w: 3, h: 1, static: true },
    { i: 'TextField', x: 0, y: 1, w: 3, h: 1, static: true },
    { i: 'TextField', x: 4, y: 1, w: 3, h: 1, static: true },
  ],
  [{ i: 'AgreementSchema', x: 0, y: 0, w: 12, h: 8, static: true }],
]

const MAX_DISPLAY_NAME_CHARACTERS = 10

export const RegisterCuratorSchemaStep1 = z.object({
  name: z
    .string()
    .length(
      MAX_DISPLAY_NAME_CHARACTERS,
      `The display name should be short than ${MAX_DISPLAY_NAME_CHARACTERS} characters.`,
    )
    .describe(
      'Display name // This is the name that will be displayed as the author of your badges.',
    ),
  description: LongTextSchema.describe(
    'Bio // Tell us about you, share some of your background with the community.',
  ),
  logo: AvatarSchema.describe('Profile photo // Upload a photo that identifies you.'), // Image Schema MUST BE the created one
})

export const RegisterCuratorSchemaStep2 = z.object({
  email: EmailSchema.describe(`Email`),
  website: z.string().describe(`Website`).optional(),
  twitter: TwitterSchema.describe(`Twitter`).optional(),
  discord: z.string().describe(`Discord`).optional(),
})

export const RegisterCuratorSchemaStep3 = z.object({
  terms: AgreementSchema.describe(`Terms & Conditions // ??`),
})

export default function RegistrationSteps({ onSubmit, txState }: RegistrationStepsProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)

  const handleOnSubmit = useCallback(
    (data: z.infer<typeof RegisterCuratorSchema>) => {
      onSubmit(data)
    },
    [onSubmit],
  )

  const handleFormPreview = useCallback(
    (data: z.infer<typeof RegisterCuratorSchema>) => {
      if (txState !== TransactionStates.none) {
        return <TransactionLoading state={txState} />
      }

      return (
        <Stack gap={2} margin={1}>
          <Typography component={'div'} variant="title3">
            Please review your data
          </Typography>
          <Stack>
            <Typography component={'div'} variant="title2">
              Creator Information
            </Typography>
            <Box display="flex" flexDirection="row">
              <Stack>
                <Typography component={'div'} variant="body1">
                  {data.name}
                </Typography>
                <Typography component={'div'} variant="body1">
                  {data.description}
                </Typography>
              </Stack>
              <Avatar>
                <img alt="" src={data.logo.data_url} width="150" />
              </Avatar>
            </Box>
            <Typography component={'div'} variant="title2">
              Creator Contact
            </Typography>
            <Stack>
              <Typography component={'div'} variant="body1">
                {data.email}
              </Typography>

              {data.discord && (
                <Typography component={'div'} variant="body1">
                  {data.discord}
                </Typography>
              )}
              {data.website && (
                <Typography component={'div'} variant="body1">
                  {data.website}
                </Typography>
              )}
              {data.twitter && (
                <Typography component={'div'} variant="body1">
                  {data.twitter}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      )
    },
    [txState],
  )

  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={colors.purple} textAlign="center" variant="title2">
          {t('creator.register.title')}
        </Typography>

        <Typography textAlign="justify" variant="body4" width="85%">
          {t(`creator.register.steps.${currentStep}.sub-title`)}
        </Typography>
      </Stack>
      <FormWithSteps
        formFieldProps={[
          {}, // TODO Review this method of send props
          {},
          {
            terms: {
              agreementText: t('creator.register.form.terms-conditions'),
            },
          },
        ]}
        formGridLayout={formGridLayout}
        formLayout={'gridResponsive'}
        formSubmitReview={handleFormPreview}
        hideSubmit={txState !== TransactionStates.none}
        onStepChanged={(sn) => setCurrentStep(sn)}
        onSubmit={handleOnSubmit}
        stepNames={steps}
        stepSchemas={[
          RegisterCuratorSchemaStep1,
          RegisterCuratorSchemaStep2,
          RegisterCuratorSchemaStep3,
        ]}
      />
    </>
  )
}
