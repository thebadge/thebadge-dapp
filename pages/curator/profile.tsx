import { ReactElement } from 'react'

import { Typography } from '@mui/material'

import DefaultLayout from '@/src/components/layout/DefaultLayout'
import { NextPageWithLayout } from '@/types/next'

const Profile: NextPageWithLayout = () => {
  return (
    <>
      <Typography component={'h3'} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography component={'h5'} variant="h5">
        This is your curator profile
      </Typography>
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Profile
