import { ReactElement } from 'react'

import { Typography } from '@mui/material'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import DefaultLayout from '@/src/components/layout/DefaultLayout'
import { NextPageWithLayout } from '@/types/next'

const ViewListOfBadges: NextPageWithLayout = () => {
  return (
    <>
      <Typography component={'h3'} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography component={'h5'} variant="h5">
        Here you can view all the Badges for the given typeId
      </Typography>
    </>
  )
}

ViewListOfBadges.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default withPageGenericSuspense(ViewListOfBadges)
