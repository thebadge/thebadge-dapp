import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { DiplomaNFTAttributesType } from '@/types/badges/BadgeMetadata'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

export default function useBadgeModelTemplate(
  modelId: string,
  targetContract?: string,
): BadgeModelTemplate {
  const badgeModelData = useBadgeModel(modelId, targetContract)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  const template = badgeModelMetadata?.attributes?.find(
    (at: { trait_type: DiplomaNFTAttributesType }) =>
      at.trait_type === DiplomaNFTAttributesType.Template,
  )

  if (!template) {
    console.warn(`No template defined for badgeModelId: ${modelId}, returning default one...`)
    return BadgeModelTemplate.Badge
  }

  return template.value as BadgeModelTemplate
}
