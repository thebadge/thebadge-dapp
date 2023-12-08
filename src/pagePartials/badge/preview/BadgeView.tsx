import * as React from 'react'

import { BadgePreview } from '@thebadge/ui-library'

import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { getBackgroundType, getTextContrast } from '@/src/utils/badges/metadataHelpers'

type BadgePreviewGeneratorProps = {
  modelId: string
  badgeUrl?: string
  additionalData?: Record<string, any>
}

export const BadgeView = ({ badgeUrl, modelId }: BadgePreviewGeneratorProps) => {
  const badgeModelData = useBadgeModel(modelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata
  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const backgroundType = getBackgroundType(badgeModelMetadata?.attributes)

  const textContrast = getTextContrast(badgeModelMetadata?.attributes)

  return (
    <BadgePreview
      animationEffects={['wobble', 'grow', 'glare']}
      animationOnHover
      badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
      badgeUrl={badgeUrl}
      category={badgeModelMetadata?.name}
      description={badgeModelMetadata?.description}
      imageUrl={badgeLogoImage?.s3Url}
      size="medium"
      textContrast={textContrast?.value || 'light-withTextBackground'}
    />
  )
}
