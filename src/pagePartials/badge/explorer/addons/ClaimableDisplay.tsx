import React from 'react'

import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import useIsClaimable from '@/src/hooks/subgraph/useIsClaimable'
import FlapAdornment from '@/src/pagePartials/badge/preview/addons/Flap'

export default function ClaimableDisplay({ badgeId }: { badgeId: string }) {
  const { t } = useTranslation()
  const { data: isClaimable } = useIsClaimable(badgeId)

  return isClaimable && <FlapAdornment color={colors.redError} label={t('badge.unclaimed')} />
}
