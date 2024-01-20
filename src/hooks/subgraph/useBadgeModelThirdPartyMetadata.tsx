import useSWR from 'swr'

import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { SubgraphName } from '@/src/subgraph/subgraph'
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
  const { readOnlyChainId } = useWeb3Connection()

  return useSWR(
    fetchIt
      ? [`BadgeModelThirdPartyMetaData:${badgeModelId}`, badgeModelId, readOnlyChainId]
      : null,
    async ([, _id]) => {
      const badgeModelKleros = await gql.badgeModelThirdPartyMetaDataById({ id: _id })
      const data = badgeModelKleros.badgeModelThirdPartyMetaData

      const requiredBadgeDataMetadata = await getFromIPFS<{
        requirementsColumns: ThirdPartyMetadataColumn[]
      }>(data?.requirementsIPFSHash)

      return {
        ...data,
        requirementsData: requiredBadgeDataMetadata?.result?.content,
      }
    },
  )
}

export function useBadgeThirdPartyRequiredData(
  badgeId: string,
  targetContract?: string,
  options?: BadgeModelHooksOptions,
) {
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeId.length
  const gql = useSubgraph(SubgraphName.TheBadge, targetContract)
  const { readOnlyChainId } = useWeb3Connection()

  return useSWR(
    fetchIt
      ? [`BadgeModelThirdPartyMetaData:${badgeId}`, badgeId, readOnlyChainId, targetContract]
      : null,
    async ([, _id]) => {
      const graphResult = await gql.badgeThirdPartyMetadataById({ id: _id })
      const data = graphResult.badgeThirdPartyMetaData

      const requiredBadgeDataValues = await getFromIPFS<{
        columns: ThirdPartyMetadataColumn[]
        values: Record<string, any>
      }>(data?.badgeDataUri)

      return {
        ...data,
        requirementsDataValues: requiredBadgeDataValues?.result?.content.values,
        requirementsDataColumns: requiredBadgeDataValues?.result?.content.columns,
      }
    },
    {
      // Fallback data, used in case of network error or loading time
      fallbackData: {
        requirementsDataValues: [],
        requirementsDataColumns: [],
      },
    },
  )
}
