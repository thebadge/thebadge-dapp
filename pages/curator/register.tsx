import { ReactElement, useCallback } from 'react'

import { Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { ErrorOption } from 'react-hook-form/dist/types/errors'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import { CustomFormFromSchema } from '@/src/components/form/CustomForm'
import {
  ExpirationTypeSchema,
  FileSchema,
  NumberSchema,
  SeverityTypeSchema,
  TokenInputSchema,
} from '@/src/components/form/helpers/customSchemas'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'

const RegisterCuratorSchema = z.object({
  name: z.string().describe('String Field // Label description'), // You can create one manually
  cel: NumberSchema.describe('Number Field // Label description'), // You can use one already create,
  image: FileSchema.describe('PDF File Field // Label description'), // Image Schema MUST BE the created one
  test: TokenInputSchema.describe('Token Field // TESTING'),
  days: ExpirationTypeSchema.describe('Expiration days // TESTING'),
  severity: SeverityTypeSchema.describe('Court Severity // Choose a value'),
})

const Register: NextPageWithLayout = () => {
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
    // gets typesafe data when form is submitted
  }

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h5">
        Here you can choose the badge type that you want to mint, and complete the process
      </Typography>

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

Register.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Register
