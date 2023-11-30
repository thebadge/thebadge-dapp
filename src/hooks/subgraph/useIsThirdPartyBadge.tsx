import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'

/**
 * Hook to determine badge controllerType, we utilize the controllerType. By querying the SG,
 * @param badgeId
 * @param targetContract
 */
export default function useIsThirdPartyBadge(badgeId: string, targetContract?: string) {
  const { data } = useBadgeById(badgeId, targetContract)
  return data?.badgeModel.controllerType === BadgeModelControllerType.ThirdParty
}
