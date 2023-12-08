import * as React from 'react'

import { Box } from '@mui/material'
import { BadgePreview, BadgePreviewProps } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import { BadgeModelMetadata, BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  metadata?: string
  badgeUrl?: string
  effects?: boolean
  size?: BadgePreviewProps['size']
  clickable?: boolean
}

function BadgeModelPreview({ badgeUrl, clickable, effects, metadata, size = 'medium' }: Props) {
  const res = useS3Metadata<{ content: BadgeModelMetadata<BackendFileResponse> }>(metadata || '')
  const badgeMetadata = res.data?.content
  const backgroundType = badgeMetadata?.attributes?.find(
    (at: { trait_type: BadgeNFTAttributesType }) =>
      at.trait_type === BadgeNFTAttributesType.Background,
  )

  const textContrast = badgeMetadata?.attributes?.find(
    (at: { trait_type: BadgeNFTAttributesType }) =>
      at.trait_type === BadgeNFTAttributesType.TextContrast,
  )

  return (
    <SafeSuspense>
      <Box sx={{ cursor: clickable ? 'pointer' : 'inherit' }}>
        <BadgePreview
          animationEffects={effects ? ['wobble', 'grow', 'glare'] : []}
          animationOnHover
          badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
          badgeUrl={badgeUrl ? badgeUrl : 'https://www.thebadge.xyz'}
          category={badgeMetadata?.name}
          description={badgeMetadata?.description}
          imageUrl={badgeMetadata?.image.s3Url}
          size={size}
          textContrast={textContrast?.value || 'light-withTextBackground'}
        />
      </Box>
    </SafeSuspense>
  )
}

export default BadgeModelPreview
