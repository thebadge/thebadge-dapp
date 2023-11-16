import React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import useIsClaimable from '@/src/hooks/subgraph/useIsClaimable'
import BadgeIdDisplay from '@/src/pagePartials/badge/explorer/addons/BadgeIdDisplay'
import BadgeRequesterPreview from '@/src/pagePartials/badge/explorer/addons/BadgeRequesterPreview'
import { Badge } from '@/types/generated/subgraph'

export default function ThirdPartyBadgeEvidenceInfoPreview({ badge }: { badge: Badge }) {
  const { t } = useTranslation()
  const isClaimable = useIsClaimable(badge.id)

  return (
    <Stack gap={4} p={1}>
      <Box alignContent="center" display="flex" flex={1} justifyContent="space-between">
        <BadgeIdDisplay id={badge?.id} mintTxHash={badge.createdTxHash} />
        {isClaimable ? (
          <Typography color={colors.redError} mb={4} textTransform="uppercase">
            {t('badge.unclaimed')}
          </Typography>
        ) : (
          <Typography color={colors.green} mb={4} textTransform="uppercase">
            {t('badge.claimed')}
          </Typography>
        )}
      </Box>

      {/* Badge Receiver Address */}
      {isClaimable ? (
        <Typography color={colors.redError} mb={4}>
          {t('badge.thirdPartyBadgeUnclaimedText')}
        </Typography>
      ) : (
        <BadgeRequesterPreview ownerAddress={badge.account.id} />
      )}
    </Stack>
  )
}
