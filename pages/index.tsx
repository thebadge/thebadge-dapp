import { ReactElement } from 'react'

import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, styled, Typography } from "@mui/material";

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const Address: React.FC = () => {
  const { address } = useWeb3ConnectedApp()

  return address ? <Typography variant="title1">{address}</Typography> : null
}

const CertificationProcess: React.FC = () => {
  return (
    <div>
      <Typography
        alignItems={'center'}
        component="span"
        display={'flex'}
        fontSize={12}
        fontWeight={900}
        justifyContent={'center'}
        lineHeight={'15px'}
        marginBottom={10}
      >
        FULL CERTIFICATION PROCESS TUTORIAL
        <ArrowForwardIosOutlinedIcon />
      </Typography>
    </div>
  )
}

const Section = styled('div')(({}) => ({
  border: '1px solid #FFFFFF',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.3)',
  borderRadius: '15px',
  minHeight: '100px',
  width: '100%',
}))

const Home: NextPageWithLayout = () => {
  const { homeSection } = useSectionReferences()

  return (
    <Box display="flex" flexDirection="column" ref={homeSection}>
      <Typography component="h2" marginBottom={2} textAlign="center" variant="h2">
        Welcome to TheBadge!
      </Typography>
      <Typography component="div" marginBottom={10} textAlign="center" variant="h5">
        DECENTRALIZED CERTIFICATION PLATFORM
      </Typography>
      <CertificationProcess />
      <Section>Claim one of these badges</Section>
      {/*<Box display="flex" flexDirection="column">*/}
      {/*<LinkWithTranslation pathname="/creator/register">1. Register Creator</LinkWithTranslation>*/}
      {/*<LinkWithTranslation pathname="/curator/register">2. Register Curator</LinkWithTranslation>*/}

      {/*<LinkWithTranslation pathname="/badge/type/create">*/}
      {/*  3. Create badge-type*/}
      {/*</LinkWithTranslation>*/}
      {/*<LinkWithTranslation pathname="/badge/mint">4. Mint badge</LinkWithTranslation>*/}
      {/*</Box>*/}
    </Box>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Home
