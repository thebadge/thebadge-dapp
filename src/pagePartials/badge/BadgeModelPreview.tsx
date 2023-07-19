import * as React from 'react'

import { BadgePreview, BadgePreviewProps } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import { BadgeModelMetadata, BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  metadata?: string
  effects?: boolean
  size?: BadgePreviewProps['size']
}

function BadgeModelPreview({ effects, metadata, size = 'medium' }: Props) {
  const res = useS3Metadata<{ content: BadgeModelMetadata<BackendFileResponse> }>(metadata || '')
  const badgeMetadata = res.data?.content
  const backgroundType = badgeMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.Background,
  )

  const textContrast = badgeMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.TextContrast,
  )

  return (
    <SafeSuspense>
      <BadgePreview
        animationEffects={effects ? ['wobble', 'grow', 'glare'] : []}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
        badgeUrl="https://www.thebadge.xyz"
        category={badgeMetadata?.name}
        description={badgeMetadata?.description}
        imageUrl={badgeMetadata?.image.s3Url}
        size={size}
        textContrast={textContrast?.value || 'light-withTextBackground'}
      />
    </SafeSuspense>
  )
}

export default BadgeModelPreview
