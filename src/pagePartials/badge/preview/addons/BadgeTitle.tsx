import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useSizeSM } from '@/src/hooks/useSize'

export default function BadgeTitle() {
  const { t } = useTranslation()

  const badgeId = useBadgeIdParam()
  const isMobile = useSizeSM()

  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }

  const badgeById = useBadgeById(badgeId)

  const badge = badgeById.data
  const badgeModel = badge?.badgeModel
  const badgeModelMetadata = badgeModel?.badgeModelMetadata

  return (
    <Stack gap={3}>
      <Typography
        sx={{
          color: colors.green,
          textShadow: '0px 0px 7px rgba(51, 255, 204, 0.6)',
        }}
        textAlign={isMobile ? 'center' : 'left'}
        variant="dAppTitle3"
      >
        {badgeModelMetadata?.name}
      </Typography>
      <Typography
        sx={{ color: colors.green, fontWeight: 'bold' }}
        textAlign={isMobile ? 'center' : 'left'}
        variant="caption"
      >
        {t('badge.viewBadge.id', { id: badgeId })}
      </Typography>
    </Stack>
  )
}
