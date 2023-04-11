import { Box, Typography, styled, useTheme } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { ButtonV2, colors } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { DOCS_URL } from '@/src/constants/common'
import BadgesInReviewSwiper from '@/src/pagePartials/home/BadgesInReviewSwiper'
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
  const { t } = useTranslation()

  const openDocs = () =>
    window.open(`${DOCS_URL}/thebadge-documentation/overview/how-it-works/curators`, '_blank')

  return (
    <SectionBox ref={earnByCuratingSection}>
      <SectionTitleBox sx={{ mb: 2 }}>
        <Box>
          <Typography variant={'caption'}>{t('home.earnByCurating.subtitle')}</Typography>
          <Typography
            mb={2.5}
            sx={{ fontSize: '25px !important', fontWeight: 700, lineHeight: '30px !important' }}
          >
            {t('home.earnByCurating.title')}
          </Typography>
        </Box>
        <LearnMoreButton
          backgroundColor={colors.transparent}
          fontColor={theme.palette.text.primary}
          onClick={openDocs}
        >
          {t('home.earnByCurating.button')}
        </LearnMoreButton>
      </SectionTitleBox>
      <SafeSuspense>
        <BadgesInReviewSwiper />
      </SafeSuspense>
    </SectionBox>
  )
}
