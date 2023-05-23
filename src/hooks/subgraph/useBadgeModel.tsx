import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

/**
 * Hooks to wrap the getBadgeType graphql query, to take advantage of the SWR cache
 * and reduce the number of queries and also reduce the repeated code
 * @param id
 */
export default function useBadgeModel(id: string) {
  const gql = useSubgraph()
  return useSWR(id.length ? [`BadgeModel:${id}`, id] : null, async ([, _id]) => {
    const response = await gql.badgeModelById({ id: _id })

    const badgeModelData = response.badgeModel

    if (!badgeModelData?.uri) {
      throw 'There was not possible to get the needed metadata. Try again in some minutes.'
    }

    const res = await getFromIPFS<BadgeModelMetadata<BackendFileResponse>>(badgeModelData?.uri)

    const badgeModelMetadata = res ? res.data.result?.content : null

    return {
      badgeModel: badgeModelData,
      badgeModelMetadata,
    }
  })
}
