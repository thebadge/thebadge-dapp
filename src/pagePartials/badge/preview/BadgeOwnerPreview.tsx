import React from 'react'

import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import TBUserInfoExpandablePreview from '@/src/components/common/TBUserInfoExpandablePreview'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'
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
  const resMetadata = useS3Metadata<{ content: CreatorMetadata }>(owner.data?.metadataUri || '')
  const ownerMetadata = resMetadata.data?.content

  return (
    <TBUserInfoExpandablePreview
      color={colors.purple}
      label={t('badge.viewBadge.owner.address')}
      metadata={ownerMetadata}
      userAddress={ownerAddress as WCAddress}
    />
  )
}
