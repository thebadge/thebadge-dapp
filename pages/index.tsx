import { Box, Typography, useTheme } from '@mui/material'
import { SectionLayout, colors, gradients } from 'thebadge-ui-library'

import BadgeCreator from '@/src/pagePartials/home/BadgeCreator'
import CertificationProcess from '@/src/pagePartials/home/CertificationProcess'
import ClaimBadges from '@/src/pagePartials/home/ClaimBadges'
import EarnByCurating from '@/src/pagePartials/home/EarnByCurating'
import ThirdParty from '@/src/pagePartials/home/ThirdParty'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { NextPageWithLayout } from '@/types/next'

const Home: NextPageWithLayout = () => {
  const { homeSection } = useSectionReferences()
  const theme = useTheme()
  const { mode } = useColorMode()
  const isDarkMode = mode === 'dark'

  return (
    <Box display="flex" flexDirection="column" ref={homeSection}>
      <Typography component="h1" marginBottom={2} textAlign="center" variant="dAppHeadline1">
        Welcome to TheBadge!
      </Typography>
      <Typography component="h2" marginBottom={10} textAlign="center" variant="dAppTitle2">
        DECENTRALIZED CERTIFICATION PLATFORM
      </Typography>

      {/* Certification process */}
      <CertificationProcess />

      {/* Claim badges */}
      <SectionLayout
        backgroundColor={colors.transparent}
        borderColor={colors.greyBackground}
        components={[{ component: <ClaimBadges /> }]}
        sx={{
          boxShadow: `0px 0px 6px ${theme.palette.mainMenu.boxShadow.main}`,
          borderWidth: 'inherit !important',
          mb: '3rem',
          borderRadius: '15px !important',
        }}
      />

      {/* Earn by curating */}
      <SectionLayout
        backgroundColor={isDarkMode ? colors.transparent : colors.greyBackground}
        components={[{ component: <EarnByCurating /> }]}
        sx={{
          borderWidth: `${isDarkMode ? '1px' : 'inherit'} !important`,
          borderColor: colors.green,
          borderTopWidth: '0 !important',
          borderTopLeftRadius: '0 !important',
          borderTopRightRadius: '0 !important',
          mb: '3rem',
          '&::before': {
            content: '""',
            background: `${gradients.gradient0} border-box`,
            border: `8px solid transparent`,
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          columnGap: '40px',
        }}
      >
        <SectionLayout
          backgroundColor={colors.transparent}
          borderColor={colors.pink}
          components={[{ component: <BadgeCreator /> }]}
          sx={{ borderRadius: '15px !important', borderWidth: '2px' }}
        />
        <SectionLayout
          backgroundColor={isDarkMode ? '#0D0D0D' : colors.transparent}
          borderColor={colors.transparent}
          components={[{ component: <ThirdParty /> }]}
          sx={{
            borderRadius: '15px !important',
            boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.3)',
          }}
        />
      </Box>
    </Box>
  )
}

export default Home
