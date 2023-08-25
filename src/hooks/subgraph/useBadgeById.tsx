import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import useChainId from '@/src/hooks/theBadge/useChainId'
import { BadgeMetadata, BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

/**
 * Hooks to wrap the getBadgeById graphql query, to take advantage of the SWR cache
 * and reduce the number of queries and also reduce the repeated code
 * @param badgeId
 */
export default function useBadgeById(badgeId: string) {
  const gql = useSubgraph()
  const chainId = useChainId()

  return useSWR(badgeId.length ? [`Badge:${badgeId}`, badgeId, chainId] : null, async () => {
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
