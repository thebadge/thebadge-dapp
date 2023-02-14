import { useCallback } from 'react'

import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { useForm } from 'react-hook-form'
import { ErrorOption } from 'react-hook-form/dist/types/errors'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { CustomFormFromSchema } from '@/src/components/form/customForms/CustomForm'
import {
  ExpirationTypeSchema,
  FileSchema,
  NumberSchema,
  SeverityTypeSchema,
  TokenInputSchema,
} from '@/src/components/form/helpers/customSchemas'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { NextPageWithLayout } from '@/types/next'

const RegisterCuratorSchema = z.object({
  name: z.string().describe('String Field // Label description'), // You can create one manually
  cel: NumberSchema.describe('Number Field // Label description'), // You can use one already create,
  image: FileSchema.describe('PDF File Field // Label description'), // Image Schema MUST BE the created one
  test: TokenInputSchema.describe('Token Field // TESTING'),
  days: ExpirationTypeSchema.describe('Expiration days // TESTING'),
  severity: SeverityTypeSchema.describe('Court Severity // Choose a value'),
})

const Register: NextPageWithLayout = () => {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof RegisterCuratorSchema>>()
  const { clearErrors, setError } = form

  const triggerTestError = useCallback(
    (error: ErrorOption) => {
      // We need to create this kind of helper function that set the error directly
      // to the form, we need to do it in the parent form component like this.
      setError('test', error)
    },
    [setError],
  )

  const cleanTestError = useCallback(() => {
    // We need to create this kind of helper function that clear the error directly
    // to the form, we need to do it in the parent form component like this.
    clearErrors('test')
  }, [clearErrors])

  async function onSubmit(data: z.infer<typeof RegisterCuratorSchema>) {
    console.log(data)
    // gets typesafe data when form is submitted
  }

  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={colors.purple} textAlign="center" variant="title2">
          {t('creator.register.title')}
        </Typography>

        <Typography textAlign="justify" variant="body4" width="85%">
          {t('creator.register.sub-title')}
        </Typography>
      </Stack>

      <CustomFormFromSchema
        form={form}
        onSubmit={onSubmit}
        props={{
          test: {
            decimals: 2,
            setError: triggerTestError,
            cleanError: cleanTestError,
            maxValue: '1000000',
          },
        }}
        schema={RegisterCuratorSchema}
      />
    </>
  )
}

export default withPageGenericSuspense(Register)
