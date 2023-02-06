import { ReactElement } from 'react'

import { Typography } from '@mui/material'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'

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

export default ViewBadge
