import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { DiplomaNFTAttributesType } from '@/types/badges/BadgeMetadata'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

export default function useBadgeModelTemplate(modelId: string): BadgeModelTemplate {
  const badgeModelData = useBadgeModel(modelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  const template = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === DiplomaNFTAttributesType.Template,
  )

  if (!template) {
    throw new Error(`No template defined for badgeModelId: ${modelId}`)
  }

  return template.value as BadgeModelTemplate
}
