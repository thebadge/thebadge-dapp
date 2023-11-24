import useSWR from 'swr'

import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import useChainId from '@/src/hooks/theBadge/useChainId'
import { ThirdPartyMetadataColumn } from '@/types/kleros/types'

/**
 * The BadgeModelThirdPartyMetadata provides additional information about a BadgeModel.
 * @param badgeModelId
 * @param options
 * @return SWRResponse<BadgeModelKlerosMetaData>
 */
export function useBadgeModelThirdPartyMetadata(
  badgeModelId: string,
  options?: BadgeModelHooksOptions,
) {
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  const gql = useSubgraph()
  const chainId = useChainId()

  return useSWR(
    fetchIt ? [`BadgeModelThirdPartyMetaData:${badgeModelId}`, badgeModelId, chainId] : null,
    async ([, _id]) => {
      const badgeModelKleros = await gql.badgeModelThirdPartyMetaDataById({ id: _id })
      const data = badgeModelKleros.badgeModelThirdPartyMetaData

      const requiredBadgeDataMetadata = await getFromIPFS<{
        content: { requirementsColumns: ThirdPartyMetadataColumn[] }
      }>(data?.requirementsIPFSHash)

      console.log(requiredBadgeDataMetadata?.data.result)
      return {
        ...data,
        requirementsData: requiredBadgeDataMetadata?.data.result?.content.content,
      }
    },
  )
}
