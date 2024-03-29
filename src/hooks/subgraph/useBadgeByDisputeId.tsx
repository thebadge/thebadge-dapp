import useSWR from 'swr'

import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { ChainsValues } from '@/types/chains'
import { Badge, BadgeKlerosMetaData, BadgeModel } from '@/types/generated/subgraph'

/**
 * Hook that is used on CourtEvidenceDataView, to be injected on Kleros site, don't use it for anything else
 * @param appChainId
 * @param disputeId
 */
export default function useBadgeByDisputeId(appChainId?: number, disputeId?: string) {
  const gql = appChainId
    ? getSubgraphSdkByNetwork(appChainId as ChainsValues, SubgraphName.TheBadge)
    : null

  return useSWR(
    appChainId && disputeId ? [`badgeByDisputeId:${disputeId}`, disputeId, appChainId] : null,
    async ([, _disputeId]) => {
      if (!gql) return {}
      const response = await gql.badgeByDisputeId({ disputeId: _disputeId })

      const klerosBadgeRequest = response.klerosBadgeRequests[0]

      if (!klerosBadgeRequest) {
        throw 'Error loading item. Are you in the correct network?'
      }
      const badge = (klerosBadgeRequest.badgeKlerosMetaData as BadgeKlerosMetaData).badge
      const requester = klerosBadgeRequest.requester
      const challenger = klerosBadgeRequest.challenger
      const badgeModel = badge.badgeModel

      return {
        badge: badge as Badge,
        requester,
        challenger,
        badgeModel: badgeModel as BadgeModel,
      }
    },
  )
}
