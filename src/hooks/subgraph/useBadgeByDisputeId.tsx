import useSWR from 'swr'

import useSWRCacheUtils from '@/src/hooks/subgraph/useSWRCacheUtilts'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { BadgeMetadata, BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { ChainsValues } from '@/types/chains'
import { Badge, BadgeKlerosMetaData, BadgeModel } from '@/types/generated/subgraph'
import { BackendFileResponse } from '@/types/utils'

export default function useBadgeByDisputeId(appChainId?: number, disputeId?: string) {
  const { saveOnCacheIfMissing } = useSWRCacheUtils()

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

      const res = await Promise.all([
        getFromIPFS<BadgeMetadata<BackendFileResponse>>(badge?.uri),
        getFromIPFS<BadgeModelMetadata<BackendFileResponse>>(badgeModel?.uri),
      ])

      const badgeMetadata = res[0] ? res[0].data.result?.content : null
      const badgeModelMetadata = res[1] ? res[1].data.result?.content : null

      saveOnCacheIfMissing([`BadgeModel:${badgeModel.id}`, badgeModel.id, undefined], {
        badgeModel,
        badgeModelMetadata,
      })

      saveOnCacheIfMissing([`Badge:${badge.id}`, badge.id, undefined], {
        ...badge,
        badgeModel: {
          ...badgeModel,
          badgeModelMetadata,
        },
        badgeMetadata,
      })

      return {
        badge: badge as Badge,
        requester,
        challenger,
        badgeModel: badgeModel as BadgeModel,
      }
    },
  )
}
