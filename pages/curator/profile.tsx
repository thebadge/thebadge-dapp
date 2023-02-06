import { ReactElement } from 'react'

import { Typography } from '@mui/material'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'

const Profile: NextPageWithLayout = () => {
  return (
    <>
      <Typography variant="h3">Welcome to THE BADGE!</Typography>

      <Typography variant="h3">This is your curator profile</Typography>
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Profile
