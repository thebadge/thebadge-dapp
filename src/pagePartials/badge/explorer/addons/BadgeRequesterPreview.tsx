import React from 'react'

import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import TBUserInfoSmallPreview from '@/src/components/common/TBUserInfoSmallPreview'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CreatorMetadata } from '@/types/badges/Creator'
import { WCAddress } from '@/types/utils'

export default function BadgeRequesterPreview({
  ownerAddress,
}: {
  ownerAddress: WCAddress
  color?: string
}) {
  const { t } = useTranslation()

  if (!ownerAddress) {
    throw `No ownerAddress provided`
  }

  const owner = useUserById(ownerAddress)
  const resMetadata = useS3Metadata<{ content: CreatorMetadata }>(owner.data?.metadataUri || '')
  const ownerMetadata = resMetadata.data?.content

  return (
    <TBUserInfoSmallPreview
      color={colors.purple}
      label={t('explorer.curate.requester')}
      metadata={ownerMetadata}
      userAddress={ownerAddress as WCAddress}
    />
  )
}
