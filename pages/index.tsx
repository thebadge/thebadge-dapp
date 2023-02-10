
import { Box, Typography, styled } from '@mui/material'

import CertificationProcess from '@/src/pagePartials/home/CertificationProcess'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { NextPageWithLayout } from '@/types/next'

const Section = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.white}`,
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
    </Box>
  )
}

export default Home
