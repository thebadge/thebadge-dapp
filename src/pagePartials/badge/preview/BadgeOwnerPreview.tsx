import React from 'react'

import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import TBUserInfoExpandablePreview from '@/src/components/common/TBUserInfoExpandablePreview'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'

export default function BadgeOwnerPreview({
  ownerAddress,
}: {
  ownerAddress: `0x${string}` | undefined
}) {
  const { t } = useTranslation()

  if (!ownerAddress) {
    throw `No ownerAddress provided`
  }

  const owner = useUserById(ownerAddress as `0x${string}`)
  const resMetadata = useS3Metadata<{ content: CreatorMetadata }>(owner.data?.metadataUri || '')
  const ownerMetadata = resMetadata.data?.content

  return (
    <TBUserInfoExpandablePreview
      color={colors.purple}
      label={t('badge.viewBadge.owner.address')}
      metadata={ownerMetadata}
      userAddress={ownerAddress as `0x${string}`}
    />
  )
}
