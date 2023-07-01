import { useSearchParams } from 'next/navigation'

import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { useCurateProvider } from '@/src/providers/curateProvider'

export default function ChallengeStatus() {
  const { t } = useTranslation()
  const { challenge } = useCurateProvider()

  const searchParams = useSearchParams()
  const badgeId = searchParams.get('badgeId')

  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }

  return (
    <Stack gap={3} mt={5}>
      <Divider color={colors.white} />
      <Box display="flex" justifyContent="space-between">
        <Typography color={'#FF4949'} variant="dAppTitle1">
          {t('badge.viewBadge.challengeStatus.title')}
        </Typography>
        <Button
          color="error"
          onClick={() => challenge(badgeId)}
          size="medium"
          sx={{ fontSize: '11px !important', borderRadius: 2 }}
          variant="outlined"
        >
          Add Evidence
        </Button>
      </Box>
      <Box display="flex" gap={4} justifyContent="space-between">
        <Stack flex="1" gap={3}>
          <Typography color={'#FF4949'} variant="dAppTitle5">
            {t('badge.viewBadge.challengeStatus.challenged')}
          </Typography>
          <Typography variant="dAppBody4">
            {t('badge.viewBadge.challengeStatus.requestType')}
          </Typography>
          <Typography variant="dAppBody4">
            {t('badge.viewBadge.challengeStatus.challenger')}
          </Typography>
          <Typography variant="dAppBody4">
            {t('badge.viewBadge.challengeStatus.requester')}
          </Typography>
          <Typography variant="dAppBody4">
            {t('badge.viewBadge.challengeStatus.arbitrator')}
          </Typography>
          <Typography variant="dAppBody4">
            {t('badge.viewBadge.challengeStatus.disputeId')}
          </Typography>
          <Divider color={colors.white} />
        </Stack>
        <Stack flex="1" gap={3}>
          <Typography color={'#FF4949'} variant="dAppTitle5">
            {t('badge.viewBadge.challengeStatus.badgeDetails')}
          </Typography>
          <Typography variant="dAppBody4">{t('badge.viewBadge.challengeStatus.user')}</Typography>
          <Typography variant="dAppBody4">{t('badge.viewBadge.challengeStatus.amount')}</Typography>
          <Typography variant="dAppBody4">
            {t('badge.viewBadge.challengeStatus.userAddress')}
          </Typography>
          <Typography variant="dAppBody4">{t('badge.viewBadge.challengeStatus.file')}</Typography>
          <Divider color={colors.white} sx={{ mt: 'auto' }} />
        </Stack>
      </Box>
    </Stack>
  )
}
