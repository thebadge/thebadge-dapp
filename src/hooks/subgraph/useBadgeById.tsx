import useSWR from 'swr'

import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useSWRCacheUtils from '@/src/hooks/subgraph/useSWRCacheUtilts'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { BadgeMetadata, BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

/**
 * Hooks to wrap the getBadgeById graphql query, to take advantage of the SWR cache
 * and reduce the number of queries and also reduce the repeated code
 * @param badgeId
 * @param targetContract
 */
export default function useBadgeById(badgeId: string, targetContract?: string) {
  const { saveOnCacheIfMissing } = useSWRCacheUtils()
  const { readOnlyChainId } = useWeb3Connection()

  // Safeguard to use the contract in the url
  // If this hooks run under a page that has the "contract" query params it must use it
  const { contract } = useBadgeIdParam()
  const gql = useSubgraph(SubgraphName.TheBadge, targetContract || contract)

  return useSWR(badgeId.length ? [`Badge:${badgeId}`, badgeId, targetContract] : null, async () => {
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

    const badgeMetadata = res[0] ? res[0].result?.content : null
    const badgeModelMetadata = res[1] ? res[1].result?.content : null

    // Save Badge Model
    saveOnCacheIfMissing([`BadgeModel:${badgeModel.id}`, badgeModel.id, targetContract], {
      badgeModel,
      badgeModelMetadata,
    })
    // Save Owner Account as user
    saveOnCacheIfMissing(
      [`user:${badge.account.id}`, badge.account.id, readOnlyChainId, targetContract],
      {
        ...badge.account,
      },
    )
    // Creator Account as user
    saveOnCacheIfMissing(
      [`user:${badgeModel.creator.id}`, badgeModel.creator.id, readOnlyChainId, targetContract],
      {
        ...badgeModel.creator,
      },
    )

    return {
      ...badge,
      badgeModel: {
        ...badgeModel,
        badgeModelMetadata,
      },
      badgeMetadata,
    }
  })
}
