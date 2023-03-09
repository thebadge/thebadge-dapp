import { Box, Divider, Typography, useTheme } from '@mui/material'
import { ButtonV2, colors } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import BadgeListTypeList from '@/src/pagePartials/home/BadgeListTypeList'
import { SectionBox, SectionTitleBox } from '@/src/pagePartials/home/SectionBoxes'
import { useSectionReferences } from '@/src/providers/referencesProvider'

export default function ClaimBadges() {
  const { claimBadgesSection } = useSectionReferences()
  const theme = useTheme()
  return (
    <SectionBox ref={claimBadgesSection}>
      <SectionTitleBox>
        <Typography
          color={colors.blue}
          fontWeight={900}
          lineHeight={'30px'}
          mb={2.5}
          variant={'h5'}
        >
          Claim one of these badges
        </Typography>
        <ButtonV2
          backgroundColor={theme.palette.button.backgroundBlue.main}
          fontColor={'#0D0D0D'}
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
          EXPLORE CERTIFICATES
        </ButtonV2>
      </SectionTitleBox>
      <Divider color={'#BDBDBD'} />
      <Box sx={{ mt: 3 }}>
        <SafeSuspense>
          <BadgeListTypeList />
        </SafeSuspense>
      </Box>
    </SectionBox>
  )
}
