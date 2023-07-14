import { useRouter } from 'next/router'

import { Box, Divider, Typography, useTheme } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import BadgeListTypeList from '@/src/pagePartials/home/BadgeListTypeList'
import { SectionBox, SectionTitleBox } from '@/src/pagePartials/home/SectionBoxes'
import { useSectionReferences } from '@/src/providers/referencesProvider'

export default function ClaimBadges() {
  const { claimBadgesSection } = useSectionReferences()
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <SectionBox ref={claimBadgesSection} sx={{ padding: '2.25rem 3.325rem 1.5rem' }}>
      <SectionTitleBox>
        <Typography
          color={colors.blue}
          fontWeight={900}
          lineHeight={'30px'}
          mb={2.5}
          variant={'h5'}
        >
          {t('home.claimBadges.title')}
        </Typography>
        <ButtonV2
          backgroundColor={theme.palette.button.backgroundBlue.main}
          fontColor={'#0D0D0D'}
          onClick={() => router.push('/badge/explorer')}
          sx={{
            borderRadius: '10px',
            fontSize: '11px !important',
            padding: '0.5rem 1rem !important',
            height: 'fit-content !important',
            lineHeight: '14px',
            fontWeight: 700,
            boxShadow: 'none',
          }}
        >
          {t('home.claimBadges.button')}
        </ButtonV2>
      </SectionTitleBox>
      <Divider color={'#BDBDBD'} />
      <Box sx={{ mt: 3, mb: -2 }}>
        <SafeSuspense>
          <BadgeListTypeList />
        </SafeSuspense>
      </Box>
    </SectionBox>
  )
}
