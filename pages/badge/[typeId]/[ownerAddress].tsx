import { ReactElement } from 'react'

import { Typography } from '@mui/material'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import DefaultLayout from '@/src/components/layout/DefaultLayout'
import { NextPageWithLayout } from '@/types/next'

const ViewBadge: NextPageWithLayout = () => {
  return (
    <>
      <Typography component={'h3'} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography component={'h5'} variant="h5">
        Here you can view a Badge type for a given Address
      </Typography>
    </>
  )
}

ViewBadge.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default withPageGenericSuspense(ViewBadge)
