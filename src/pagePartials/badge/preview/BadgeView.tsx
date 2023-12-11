import * as React from 'react'

import { BadgePreview } from '@thebadge/ui-library'

import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { getClassicConfigs } from '@/src/utils/badges/metadataHelpers'
import enrichTextWithValues, { EnrichTextValues } from '@/src/utils/enrichTextWithValues'
import { ClassicBadgeFieldsConfig } from '@/types/badges/BadgeMetadata'

type BadgePreviewGeneratorProps = {
  modelId: string
  badgeUrl?: string
  additionalData?: Record<string, any>
}

export const BadgeView = ({ additionalData, badgeUrl, modelId }: BadgePreviewGeneratorProps) => {
  const badgeModelData = useBadgeModel(modelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata
  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const { backgroundType, fieldsConfigs, textContrast } = getClassicConfigs(
    badgeModelMetadata?.attributes,
  )

  const { data: fieldsConfigData } = useS3Metadata<{
    content: ClassicBadgeFieldsConfig
  }>((fieldsConfigs?.value as string) || '')

  const customFieldsEnable = fieldsConfigData.customFieldsEnabled

  return (
    <BadgePreview
      animationEffects={['wobble', 'grow', 'glare']}
      animationOnHover
      badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
      badgeUrl={badgeUrl}
      category={
        customFieldsEnable
          ? enrichTextWithValues(fieldsConfigData?.badgeTitle, additionalData as EnrichTextValues)
          : badgeModelMetadata?.name
      }
      description={
        customFieldsEnable
          ? enrichTextWithValues(
              fieldsConfigData?.badgeDescription,
              additionalData as EnrichTextValues,
            )
          : badgeModelMetadata?.description
      }
      imageUrl={badgeLogoImage?.s3Url}
      size="medium"
      textContrast={textContrast?.value || 'light-withTextBackground'}
    />
  )
}
