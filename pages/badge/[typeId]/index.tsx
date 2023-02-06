import { ReactElement } from 'react'

import { Typography } from '@mui/material'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'

const ViewListOfBadges: NextPageWithLayout = () => {
  return (
    <>
      <Typography variant="h3">Welcome to THE BADGE!</Typography>

      <Typography variant="h5">Here you can view all the Badges for the given typeId</Typography>
    </>
  )
}

ViewListOfBadges.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default ViewListOfBadges
