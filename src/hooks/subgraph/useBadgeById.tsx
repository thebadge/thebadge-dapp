import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { BadgeMetadata, BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

/**
 * Hooks to wrap the getBadgeById graphql query, to take advantage of the SWR cache
 * and reduce the number of queries and also reduce the repeated code
 * @param badgeId
 * @param targetContract
 */
export default function useBadgeById(badgeId: string, targetContract?: string) {
  const gql = useSubgraph(SubgraphName.TheBadge, targetContract)

  return useSWR(badgeId.length ? [`Badge:${badgeId}`, badgeId] : null, async () => {
    const badgeResponse = await gql.badgeById({ id: badgeId })

    const badge = badgeResponse.badge
    const badgeModel = badge?.badgeModel

    if (!badge?.uri || !badgeModel?.uri) {
      throw 'There was not possible to get the needed metadata. Try again in some minutes.'
    }

    const res = await Promise.all([
      getFromIPFS<BadgeMetadata<BackendFileResponse>>(badge?.uri),
      getFromIPFS<BadgeModelMetadata<BackendFileResponse>>(badgeModel?.uri),
    ])

    const badgeMetadata = res[0] ? res[0].data.result?.content : null
    const badgeModelMetadata = res[1] ? res[1].data.result?.content : null

    return {
      ...badge,
      badgeModel: {
        ...badge.badgeModel,
        badgeModelMetadata,
      },
      badgeMetadata,
    }
  })
}
