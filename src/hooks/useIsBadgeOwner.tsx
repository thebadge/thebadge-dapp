import useSWR from 'swr'

import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export default function useIsBadgeOwner(typeId: string, ownerAddress: string) {
  const { appChainId } = useWeb3Connection()
  const badgeId = `${ownerAddress}-${typeId}`
  return useSWR(badgeId.length ? `isOwnerBadge:${badgeId}` : null, async (_badgeId: string) => {
    const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
    const badgeResponse = await gql.badgeById({ id: badgeId })
    const badge = badgeResponse.badge
    return !!badge
  })
}
