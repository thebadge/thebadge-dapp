import * as React from 'react'

import { BadgePreview } from '@thebadge/ui-library'

import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useAvailableBackgrounds } from '@/src/hooks/useAvailableBackgrounds'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
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
  const { address, readOnlyChainId } = useWeb3Connection()
  const { modelBackgrounds } = useAvailableBackgrounds(readOnlyChainId, address)

  const { backgroundType, fieldsConfigs, textContrast } = getClassicConfigs(
    badgeModelMetadata?.attributes,
  )

  const { data: fieldsConfigData } = useS3Metadata<{
    content: ClassicBadgeFieldsConfig
  }>((fieldsConfigs?.value as string) || '')

  return (
    <BadgePreview
      animationEffects={['wobble', 'grow', 'glare']}
      animationOnHover
      badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value, modelBackgrounds)}
      badgeUrl={badgeUrl}
      category={enrichTextWithValues(badgeModelMetadata?.name, additionalData as EnrichTextValues)}
      description={enrichTextWithValues(
        badgeModelMetadata?.description,
        additionalData as EnrichTextValues,
      )}
      imageUrl={badgeLogoImage?.s3Url}
      miniLogoSubTitle={fieldsConfigData?.content.miniLogoSubTitle}
      miniLogoTitle={fieldsConfigData?.content.miniLogoTitle}
      miniLogoUrl={fieldsConfigData?.content.miniLogoUrl}
      size="medium"
      textContrast={textContrast?.value || 'light-withTextBackground'}
    />
  )
}
