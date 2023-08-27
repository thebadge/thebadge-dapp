import useSWR from 'swr'

import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { ChainsValues } from '@/types/chains'

export default function useBadgeByDisputeId(appChainId?: number, disputeId?: string) {
  const gql = appChainId
    ? getSubgraphSdkByNetwork(appChainId as ChainsValues, SubgraphName.TheBadge)
    : null

  console.log('Parameters', {
    appChainId,
    disputeId,
  })
  return useSWR(
    appChainId && disputeId ? [`badgeByDisputeId:${disputeId}`, disputeId, appChainId] : null,
    async ([, _disputeId]) => {
      if (!gql) return {}
      const response = await gql.badgeByDisputeId({ disputeId: _disputeId })

      const klerosBadgeRequest = response.klerosBadgeRequests[0]

      if (!klerosBadgeRequest) {
        throw 'Error loading item. Are you in the correct network?'
      }
      const badge = klerosBadgeRequest.badgeKlerosMetaData?.badge
      const requester = klerosBadgeRequest.requester
      const challenger = klerosBadgeRequest.challenger
      const badgeModel = badge?.badgeModel

      return {
        badge,
        requester,
        challenger,
        badgeModel,
      }
    },
  )
}
