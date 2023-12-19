import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { getBadgeModelTemplate } from '@/src/utils/badges/metadataHelpers'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

export default function useBadgeModelTemplate(
  modelId: string,
  targetContract?: string,
): BadgeModelTemplate {
  const badgeModelData = useBadgeModel(modelId, targetContract)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  const template = getBadgeModelTemplate(badgeModelMetadata?.attributes)

  if (!template) {
    console.warn(`No template defined for badgeModelId: ${modelId}, returning default one...`)
    return BadgeModelTemplate.Badge
  }

  return template.value
}
