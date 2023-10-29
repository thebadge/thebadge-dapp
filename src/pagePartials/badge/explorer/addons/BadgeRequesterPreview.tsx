import React from 'react'

import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import TBUserInfoSmallPreview from '@/src/components/common/TBUserInfoSmallPreview'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useIsUserVerified from '@/src/hooks/theBadge/useIsUserVerified'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'

export default function BadgeRequesterPreview({
  ownerAddress,
}: {
  ownerAddress: string
  color?: string
}) {
  const { t } = useTranslation()

  if (!ownerAddress) {
    throw `No ownerAddress provided`
  }

  const owner = useUserById(ownerAddress)
  const resMetadata = useS3Metadata<{ content: CreatorMetadata }>(owner.data?.metadataUri || '')
  const ownerMetadata = resMetadata.data?.content
  const isVerified = useIsUserVerified(ownerAddress, 'kleros')

  return (
    <TBUserInfoSmallPreview
      color={colors.purple}
      isVerified={isVerified.data}
      label={t('explorer.curate.requester')}
      metadata={ownerMetadata}
      userAddress={ownerAddress}
    />
  )
}
