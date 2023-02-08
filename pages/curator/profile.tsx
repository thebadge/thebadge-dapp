import { Typography } from '@mui/material'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
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

export default withPageGenericSuspense(Profile)
