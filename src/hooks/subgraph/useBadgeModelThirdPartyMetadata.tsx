import useSWR from 'swr'

import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import useChainId from '@/src/hooks/theBadge/useChainId'
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
  const chainId = useChainId()

  return useSWR(
    fetchIt ? [`BadgeModelThirdPartyMetaData:${badgeModelId}`, badgeModelId, chainId] : null,
    async ([, _id]) => {
      const badgeModelKleros = await gql.badgeModelThirdPartyMetaDataById({ id: _id })
      const data = badgeModelKleros.badgeModelThirdPartyMetaData

      const requiredBadgeDataMetadata = await getFromIPFS<{
        requirementsColumns: ThirdPartyMetadataColumn[]
      }>(data?.requirementsIPFSHash)

      return {
        ...data,
        requirementsData: requiredBadgeDataMetadata?.data.result?.content,
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
  const chainId = useChainId()

  return useSWR(
    fetchIt ? [`BadgeModelThirdPartyMetaData:${badgeId}`, badgeId, chainId, targetContract] : null,
    async ([, _id]) => {
      const graphResult = await gql.badgeThirdPartyMetadataById({ id: _id })
      const data = graphResult.badgeThirdPartyMetaData

      const requiredBadgeDataValues = await getFromIPFS<{
        columns: ThirdPartyMetadataColumn[]
        values: Record<string, any>
      }>(data?.badgeDataUri)

      return {
        ...data,
        requirementsDataValues: requiredBadgeDataValues?.data.result?.content.values,
        requirementsDataColumns: requiredBadgeDataValues?.data.result?.content.columns,
      }
    },
  )
}
