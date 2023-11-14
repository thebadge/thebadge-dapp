import React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import LinkWithTranslation from '@/src/components/helpers/LinkWithTranslation'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useSizeSM } from '@/src/hooks/useSize'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

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
  const { getExplorerUrl } = useWeb3Connection()

  return (
    <Stack gap={isMobile ? 1 : 3}>
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
        {badge?.claimedTxHash && (
          <LinkWithTranslation pathname={getExplorerUrl(badge?.claimedTxHash)} target={'_blank'}>
            {t('badge.viewBadge.id', { id: badgeId })}
          </LinkWithTranslation>
        )}
      </Typography>
    </Stack>
  )
}
