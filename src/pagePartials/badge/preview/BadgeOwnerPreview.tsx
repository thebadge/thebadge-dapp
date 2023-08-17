import React from 'react'

import { colors } from '@thebadge/ui-library'

import TBUserInfoExpandablePreview from '@/src/components/common/TBUserInfoMenuPreview'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'

export default function BadgeOwnerPreview({ ownerAddress }: { ownerAddress: string }) {
  if (!ownerAddress) {
    throw `No ownerAddress provided`
  }

  const owner = useUserById(ownerAddress)
  const resMetadata = useS3Metadata<{ content: CreatorMetadata }>(owner.data?.metadataUri || '')
  const ownerMetadata = resMetadata.data?.content

  return (
    <TBUserInfoExpandablePreview
      color={colors.purple}
      isVerified={owner?.data?.isVerified}
      metadata={ownerMetadata}
      userAddress={ownerAddress}
    />
  )
}
