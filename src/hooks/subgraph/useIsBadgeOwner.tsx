import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { WCAddress } from '@/types/utils'

/**
 * Hook to determine badge ownership, we utilize the potential Owner Address and the badgeModelId. By querying the SG,
 * we retrieve all badges associated with the provided address that belong to the model of the given modelId.
 * @param badgeModelId
 * @param ownerAddress
 */
export default function useIsBadgeOwnerByModelId(
  badgeModelId: string,
  ownerAddress: WCAddress | undefined,
) {
  const userWithOwnerBadges = useBadgesOwnedByModelId(badgeModelId, ownerAddress)
  if (!ownerAddress) return false
  return !!userWithOwnerBadges.data?.user?.badges?.length
}

export function useIsBadgeModelOwner(modelId: string, ownerAddress: WCAddress | undefined) {
  const ownedModels = useBadgeModelOwnedByModelId(modelId, ownerAddress)
  if (!ownerAddress) return false
  return !!ownedModels.data
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
  const { readOnlyChainId } = useWeb3Connection()

  return useSWR(
    [`OwnedBadges:${badgeModelId}:${ownerAddress}`, ownerAddress, readOnlyChainId],
    async ([_badgeModelId, _ownerAddress]) => {
      if (!_badgeModelId.length || !_ownerAddress?.length) {
        return {}
      }
      const badgeResponse = await gql.userBadgeByModelId({
        userId: _ownerAddress as string,
        modelId: _badgeModelId,
      })
      return badgeResponse ? badgeResponse : {}
    },
  )
}

/**
 * Private hook to simplify the logic and also use just one call to the SG
 * @param modelId
 * @param ownerAddress
 */
function useBadgeModelOwnedByModelId(modelId: string, ownerAddress: WCAddress | undefined) {
  const gql = useSubgraph()

  return useSWR([modelId, ownerAddress], async ([_modelId, _ownerAddress]) => {
    if (!_ownerAddress?.length) {
      return {}
    }

    const badgeModel = await gql.badgeModelById({
      id: _modelId,
    })

    return (
      badgeModel?.badgeModel &&
      badgeModel.badgeModel?.creator?.id.toLowerCase() === _ownerAddress.toLowerCase()
    )
  })
}
