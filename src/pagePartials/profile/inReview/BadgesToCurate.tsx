import { useRouter } from 'next/navigation'

import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { BoxBorderGradient, gradients } from 'thebadge-ui-library'

export default function BadgesToCurate() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <BoxBorderGradient animated gradient={gradients.gradient0}>
      <Box alignItems="center" display="flex" flex={1} justifyContent="space-between" m={3}>
        <Typography textAlign="center" variant="title4">
          {t('profile.badgesToCurate')}
        </Typography>
        <Button
          color="green"
          onClick={() => router.push('badge/explorer')}
          sx={{ borderRadius: '10px' }}
          variant="contained"
        >
          Explore
        </Button>
      </Box>
    </BoxBorderGradient>
  )
}
