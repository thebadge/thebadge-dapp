import { ReactElement } from 'react'

import { Box, Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import { useSectionReferences } from '@/src/providers/referencesProvider'

const Home: NextPageWithLayout = () => {
  const { homeSection } = useSectionReferences()

  return (
    <Box display="flex" flexDirection="column" ref={homeSection}>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>
      <Box display="flex" flexDirection="column">
        <LinkWithTranslation pathname="/creator/register">1. Register Creator</LinkWithTranslation>
        <LinkWithTranslation pathname="/curator/register">2. Register Curator</LinkWithTranslation>

        <LinkWithTranslation pathname="/badge/type/create">
          3. Create badge-type
        </LinkWithTranslation>
        <LinkWithTranslation pathname="/badge/mint">4. Mint badge</LinkWithTranslation>
      </Box>
    </Box>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Home
