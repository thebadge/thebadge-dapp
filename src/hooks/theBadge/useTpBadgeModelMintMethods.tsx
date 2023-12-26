import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import { MINT_THIRD_PARTY_METHODS } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

export default function useTpBadgeModelMintMethods(
  modelId: string,
): typeof MINT_THIRD_PARTY_METHODS | ['address'] {
  const badgeModelData = useBadgeModel(modelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata
  const template = useBadgeModelTemplate(modelId)

  if (template === BadgeModelTemplate.Diploma) {
    return MINT_THIRD_PARTY_METHODS
  }

  // If the creator is using the recipient address, that's the only enabled option, not email
  if (
    badgeModelMetadata.name.includes('{{address}}') ||
    badgeModelMetadata.description.includes('{{address}}')
  ) {
    return ['address']
  }

  return MINT_THIRD_PARTY_METHODS
}
