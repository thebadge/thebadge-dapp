import useSWR from 'swr'

import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useSWRCacheUtils from '@/src/hooks/subgraph/useSWRCacheUtilts'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

/**
 * Hooks to wrap the getBadgeType graphql query, to take advantage of the SWR cache
 * and reduce the number of queries and also reduce the repeated code
 * @param id
 * @param targetContract
 */
export default function useBadgeModel(id: string, targetContract?: string) {
  // Safeguard to use the contract in the url
  // If this hooks run under a page that has the "contract" query params it must use it
  const { contract } = useBadgeIdParam()
  const { saveOnCacheIfMissing } = useSWRCacheUtils()
  const { readOnlyChainId } = useWeb3Connection()

  const gql = useSubgraph(SubgraphName.TheBadge, targetContract || contract)

  return useSWR(
    id.length ? [`BadgeModel:${id}`, id, targetContract] : null,
    async ([, _id]) => {
      const response = await gql.badgeModelById({ id: _id })

      const badgeModel = response.badgeModel

      if (!badgeModel?.uri) {
        throw 'There was not possible to get the needed metadata. Try again in some minutes.'
      }

      const res = await getFromIPFS<BadgeModelMetadata<BackendFileResponse>>(badgeModel?.uri)

      const badgeModelMetadata = res ? res.data.result?.content : null

      // Creator Account as user
      saveOnCacheIfMissing(
        [`user:${badgeModel.creator.id}`, badgeModel.creator.id, readOnlyChainId, targetContract],
        {
          ...badgeModel.creator,
        },
      )

      return {
        badgeModel,
        badgeModelMetadata,
      }
    },
    {
      revalidateIfStale: false,
    },
  )
}
