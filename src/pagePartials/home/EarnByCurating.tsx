import { Box, Typography, styled, useTheme } from '@mui/material'
import { ButtonV2, colors } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import BadgeListInReview from '@/src/pagePartials/home/BadgeListInReview'
import { SectionBox, SectionTitleBox } from '@/src/pagePartials/home/SectionBoxes'
import { useSectionReferences } from '@/src/providers/referencesProvider'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const LearnMoreButton = styled(ButtonV2)(({ theme }) => ({
  borderRadius: '10px',
  fontSize: '11px !important',
  padding: '0.5rem 1rem !important',
  height: 'fit-content !important',
  lineHeight: '14px',
  fontWeight: 700,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.text.primary}`,
  '&:hover': {
    backgroundColor: colors.transparent,
    border: `1px solid ${theme.palette.text.secondary}`,
    color: theme.palette.text.secondary,
  },
}))

export default function EarnByCurating() {
  const { earnByCuratingSection } = useSectionReferences()
  const theme = useTheme()

  return (
    <SectionBox ref={earnByCuratingSection}>
      <SectionTitleBox>
        <Box>
          <Typography variant={'caption'}>Become a Curator</Typography>
          <Typography
            mb={2.5}
            sx={{ fontSize: '25px !important', fontWeight: 700, lineHeight: '30px !important' }}
          >
            Earn by Curating
          </Typography>
        </Box>

        <LearnMoreButton
          backgroundColor={colors.transparent}
          fontColor={theme.palette.text.primary}
        >
          LEARN MORE
        </LearnMoreButton>
      </SectionTitleBox>
      <SafeSuspense>
        <BadgeListInReview />
      </SafeSuspense>
    </SectionBox>
  )
}
