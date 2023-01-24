import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'

import { DefaultLayout } from '@/src/components/layout/BaseLayout'

const MintBadgeType: NextPageWithLayout = () => {
  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h5">
        Here you can complete the process to mint a badge type
      </Typography>
    </>
  )
}

MintBadgeType.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default MintBadgeType
