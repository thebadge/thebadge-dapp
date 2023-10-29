import React from 'react'

import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import TBUserInfoExpandablePreview from '@/src/components/common/TBUserInfoMenuPreview'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useIsUserVerified from '@/src/hooks/theBadge/useIsUserVerified'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'

export default function BadgeOwnerPreview({ ownerAddress }: { ownerAddress: string }) {
  const { t } = useTranslation()

  if (!ownerAddress) {
    throw `No ownerAddress provided`
  }

  const owner = useUserById(ownerAddress)
  const resMetadata = useS3Metadata<{ content: CreatorMetadata }>(owner.data?.metadataUri || '')
  const ownerMetadata = resMetadata.data?.content
  const isVerified = useIsUserVerified(ownerAddress, 'kleros')

  return (
    <TBUserInfoExpandablePreview
      color={colors.purple}
      isVerified={isVerified.data}
      label={t('badge.viewBadge.owner.address')}
      metadata={ownerMetadata}
      userAddress={ownerAddress}
    />
  )
}
