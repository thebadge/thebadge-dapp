import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'

const Profile: NextPageWithLayout = () => {
  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h3">
        This is your curator profile
      </Typography>
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Profile
