import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useChainId from '@/src/hooks/theBadge/useChainId'
import { WCAddress } from '@/types/utils'

/**
 * Hook to determine badge ownership, we utilize the potential Owner Address and the badgeModelId. By querying the SG,
 * we retrieve all badges associated with the provided address that belong to the model of the given modelId.
 * @param badgeModelId
 * @param ownerAddress
 */
export default function useIsBadgeOwner(badgeModelId: string, ownerAddress: WCAddress | undefined) {
  const userWithOwnerBadges = useBadgesOwnedByModelId(badgeModelId, ownerAddress)
  if (!ownerAddress) return false
  return !!userWithOwnerBadges.data?.user?.badges?.length
}

/**
 * Hook to get the Status and Creation date of each already owned badge under the given modelId
 * @param badgeModelId
 * @param ownerAddress
 */
export function useBadgeOwnershipData(badgeModelId: string, ownerAddress: WCAddress | undefined) {
  const userWithOwnerBadges = useBadgesOwnedByModelId(badgeModelId, ownerAddress)
  return userWithOwnerBadges.data?.user?.badges
}

/**
 * Private hook to simplify the logic and also use just one call to the SG
 * @param badgeModelId
 * @param ownerAddress
 */
function useBadgesOwnedByModelId(badgeModelId: string, ownerAddress: WCAddress | undefined) {
  const gql = useSubgraph()
  const chainId = useChainId()

  return useSWR(
    badgeModelId.length && ownerAddress?.length
      ? [`OwnedBadges:${badgeModelId}:${ownerAddress}`, ownerAddress, chainId]
      : null,
    async ([,]) => {
      const badgeResponse = await gql.userBadgeByModelId({
        userId: ownerAddress as string,
        modelId: badgeModelId,
      })
      return badgeResponse ? badgeResponse : {}
    },
  )
}
