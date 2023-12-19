'use client'
import { Box, Stack, styled, useTheme } from '@mui/material'
import { SectionLayout, colors, gradients } from '@thebadge/ui-library'

import BadgeCreator from '@/src/pagePartials/home/BadgeCreator'
import FrequentlyQuestions from '@/src/pagePartials/home/FrequentQuestions'
import ThirdParty from '@/src/pagePartials/home/ThirdParty'
import WelcomeDecoration from '@/src/pagePartials/home/WelcomeDecoration'
import ClaimBadges from '@/src/pagePartials/home/carousels/ClaimBadges'
import EarnByCurating from '@/src/pagePartials/home/carousels/EarnByCurating'
import ProtocolStatistics from '@/src/pagePartials/home/statistics/ProtocolStatistics'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { useColorMode } from '@/src/providers/themeProvider'
import { NextPageWithLayout } from '@/types/next'

const SectionContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing(5),
  [theme.breakpoints.down(1000)]: {
    flexDirection: 'column',
  },
}))

const Home: NextPageWithLayout = () => {
  const { homeSection } = useSectionReferences()
  const theme = useTheme()
  const { mode } = useColorMode()
  const isDarkMode = mode === 'dark'

  return (
    <Box display="flex" flexDirection="column" ref={homeSection}>
      <WelcomeDecoration />

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

      <SectionContainer>
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
      </SectionContainer>

      <ProtocolStatistics />

      {/* FAQs */}
      <FrequentlyQuestions />
    </Box>
  )
}

export default Home
