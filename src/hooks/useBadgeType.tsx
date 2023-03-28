import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { BackendResponse } from '@/types/utils'

/**
 * Hooks to wrap the getBadgeType graphql query, to take advantage of the SWR cache
 * and reduce the number of queries and also reduce the repeated code
 * @param typeId
 */
export default function useBadgeType(typeId: string) {
  const { appChainId } = useWeb3Connection()
  return useSWR(typeId.length ? `BadgeType:${typeId}` : null, async (_typeId: string) => {
    const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
    const badgeType = await gql.badgeType({ id: typeId })

    const badgeTypeData = badgeType.badgeType

    if (!badgeTypeData?.klerosBadge?.klerosMetadataURL) {
      throw 'There was not possible to get the needed metadata. Try again in some minutes.'
    }

    const cleanedHash = badgeTypeData?.klerosBadge?.klerosMetadataURL.replace(/^ipfs?:\/\//, '')

    // TODO: hardcoded for now, as we only support Kleros.
    const res = await axios.get<BackendResponse<{ content: KlerosListStructure }>>(
      `${BACKEND_URL}/api/ipfs/${cleanedHash}`,
    )
    const badgeTypeMetadata = res.data.result?.content

    return {
      badgeType: badgeTypeData,
      badgeTypeMetadata,
    }
  })
}
