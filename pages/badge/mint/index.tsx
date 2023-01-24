import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'

const MintBadge: NextPageWithLayout = () => {
  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h5">
        Here you can choose the badge type that you want to mint, and complete the process
      </Typography>
    </>
  )
}

MintBadge.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default MintBadge
