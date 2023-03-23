import { useRouter } from 'next/navigation'

import { Box, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { BoxBorderGradient, ButtonV2, colors, gradients } from 'thebadge-ui-library'

export default function CreateNewBadge() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <BoxBorderGradient animated gradient={gradients.gradient0}>
      <Box alignItems="center" display="flex" flex={1} justifyContent="space-between" m={3}>
        <Typography textAlign="center" variant="title4">
          {t('profile.createdBadges')}
        </Typography>
        <ButtonV2
          backgroundColor={colors.greenLogo}
          fontColor={colors.black}
          onClick={() => router.push('badge/type/create')}
          sx={{
            borderRadius: '10px',
            fontSize: '12px !important',
            padding: '0.5rem 1rem !important',
            height: 'fit-content !important',
            lineHeight: '14px',
            fontWeight: 700,
            boxShadow: 'none',
          }}
        >
          CREATE CERTIFICATES
        </ButtonV2>
      </Box>
    </BoxBorderGradient>
  )
}
