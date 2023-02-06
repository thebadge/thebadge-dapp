import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import { CustomFormFromSchema } from '@/src/components/form/customForms/CustomForm'
import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import { KLEROS_LIST_TYPES } from '@/types/kleros/types'

const HARDCODED_TEST_FIELDS = [
  {
    label: 'Github account',
    description: 'Enter your Github account',
    type: KLEROS_LIST_TYPES.TEXT,
    isIdentifier: true,
  },
  {
    label: 'Twitter account',
    description: 'Enter your Twitter account',
    type: KLEROS_LIST_TYPES.TWITTER_USER_ID,
    isIdentifier: false,
  },
  {
    label: 'Just a number',
    description: 'Enter a number',
    type: KLEROS_LIST_TYPES.NUMBER,
    isIdentifier: false,
  },
  {
    label: 'Your address',
    description: 'Enter your eth address',
    type: KLEROS_LIST_TYPES.ADDRESS,
    isIdentifier: false,
  },
  {
    label: 'Just a boolean',
    description: 'true / false',
    type: KLEROS_LIST_TYPES.BOOLEAN,
    isIdentifier: false,
  },
  {
    label: 'Long text input',
    description: 'You can enter a very long text here, go ahead and try it',
    type: KLEROS_LIST_TYPES.LONG_TEXT,
    isIdentifier: false,
  },

  {
    label: 'Upload your file',
    description: '',
    type: KLEROS_LIST_TYPES.FILE,
    isIdentifier: false,
  },
]
const MintBadgeType: NextPageWithLayout = () => {
  const CreateBadgeSchema = klerosSchemaFactory(HARDCODED_TEST_FIELDS)

  function onSubmit(data: z.infer<typeof CreateBadgeSchema>) {
    // gets typesafe data when form is submitted
  }
  return (
    <>
      <Typography component={'h3'} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography component={'h5'} variant="h5">
        Here you can complete the process to mint a badge type
      </Typography>

      <CustomFormFromSchema onSubmit={onSubmit} schema={CreateBadgeSchema} />
    </>
  )
}

MintBadgeType.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default MintBadgeType
