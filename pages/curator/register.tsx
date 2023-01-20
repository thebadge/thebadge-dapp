import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import { CustomFormFromSchema } from '@/src/components/form/CustomForm'
import { ImageSchema, NumberSchema } from '@/src/components/form/helpers/customSchemas'
import { DefaultLayout } from '@/src/components/layout/BaseLayout'

const Register: NextPageWithLayout = () => {
  const RegisterCuratorSchema = z.object({
    name: z.string().describe('Field Label // Label description'), // You can create one manually
    cel: NumberSchema.describe('Field Label // Label description'), // You can use one already create,
    image: ImageSchema.describe('Field Label // Label description'), // Image Schema MUST BE the created one
  })
  function onSubmit(data: z.infer<typeof RegisterCuratorSchema>) {
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

      <CustomFormFromSchema onSubmit={onSubmit} schema={RegisterCuratorSchema} />
    </>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Register
