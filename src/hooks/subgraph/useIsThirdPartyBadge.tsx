import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'

/**
 * Hook to determine badge controllerType, we utilize the controllerType. By querying the SG,
 * @param badgeId
 */
export default function useIsThirdPartyBadge(badgeId: string) {
  const { data } = useBadgeById(badgeId)
  return data?.badgeModel.controllerType === BadgeModelControllerType.ThirdParty
}
