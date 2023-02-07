import { ReactElement } from 'react'

import { Box, Typography } from '@mui/material'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { pageWithGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import DefaultLayout from '@/src/components/layout/DefaultLayout'
import { NextPageWithLayout } from '@/types/next'

const MintBadge: NextPageWithLayout = () => {
  return (
    <>
      <Typography component={'h3'} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography component={'h5'} variant="h5">
        Here you can choose the badge type that you want to mint, and complete the process
      </Typography>

      <Box display="flex" flexDirection="column">
        <LinkWithTranslation pathname="/badge/mint/1">+ Mint badge 1</LinkWithTranslation>
        <LinkWithTranslation pathname="/badge/mint/2">+ Mint badge 2</LinkWithTranslation>
        <LinkWithTranslation pathname="/badge/mint/3">+ Mint badge 3</LinkWithTranslation>
      </Box>
    </>
  )
}

MintBadge.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default pageWithGenericSuspense(MintBadge)
