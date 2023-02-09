import { ReactElement } from 'react'

import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, Typography, styled } from '@mui/material'

import { Choose } from '../public/shareable/choose'
import { Complete } from '../public/shareable/complete'
import { Evidence } from '../public/shareable/evidence'
import DefaultLayout from '../src/components/layout/DefaultLayout'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { NextPageWithLayout } from '@/types/next'

const CertificationProcess: React.FC = () => {
  return (
    <div>
      <Box display={'flex'} flexDirection={'row'} gap={8} justifyContent={'center'} mb={4}>
        <Choose />
        <Evidence />
        <Complete />
      </Box>
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

Home.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Home
