import { ReactElement } from 'react'

import { Box, Typography } from '@mui/material'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const Address: React.FC = () => {
  const { address } = useWeb3ConnectedApp()

  return address ? <Typography variant="title1">{address}</Typography> : null
}

const Home: NextPageWithLayout = () => {
  const { homeSection } = useSectionReferences()

  return (
    <Box display="flex" flexDirection="column" ref={homeSection}>
      <Typography
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
        variant="h2"
      >
        Welcome to The Badge!
      </Typography>
      <Box display="flex" flexDirection="column">
        {/*<LinkWithTranslation pathname="/creator/register">1. Register Creator</LinkWithTranslation>*/}
        {/*<LinkWithTranslation pathname="/curator/register">2. Register Curator</LinkWithTranslation>*/}

        {/*<LinkWithTranslation pathname="/badge/type/create">*/}
        {/*  3. Create badge-type*/}
        {/*</LinkWithTranslation>*/}
        {/*<LinkWithTranslation pathname="/badge/mint">4. Mint badge</LinkWithTranslation>*/}
      </Box>
    </Box>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Home
