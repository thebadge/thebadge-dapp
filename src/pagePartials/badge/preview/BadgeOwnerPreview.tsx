import React from 'react'

import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import TBUserInfoExpandablePreview from '@/src/components/common/TBUserInfoExpandablePreview'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import { WCAddress } from '@/types/utils'

export default function BadgeOwnerPreview({
  ownerAddress,
}: {
  ownerAddress: WCAddress | undefined
}) {
  const { t } = useTranslation()
  const { contract } = useBadgeIdParam()

  if (!ownerAddress) {
    throw `No ownerAddress provided`
  }

  const owner = useUserById(ownerAddress as WCAddress, contract)
  const ownerMetadata = useUserMetadata(owner.data?.id, owner.data?.metadataUri || '')

  return (
    <TBUserInfoExpandablePreview
      color={colors.purple}
      label={t('badge.viewBadge.owner.address')}
      metadata={ownerMetadata}
      userAddress={ownerAddress as WCAddress}
    />
  )
}
