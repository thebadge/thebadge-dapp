import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import KlerosDynamicFieldsCreator from '@/src/components/form/klerosDynamicFormField/FormFieldCreator'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'

const Create: NextPageWithLayout = () => {
  return (
    <>
      <Typography variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography variant="h3">
        Please fulfill the form
      </Typography>

      <KlerosDynamicFieldsCreator />
    </>
  )
}

Create.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Create
