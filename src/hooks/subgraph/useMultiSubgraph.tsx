import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { ChainsValues } from '@/types/chains'

/**
 *
 * @param subgraphName
 * @param chainIds
 */
export default function useMultiSubgraph(
  subgraphName: SubgraphName = SubgraphName.TheBadge,
  chainIds: Array<ChainsValues>,
) {
  return chainIds.map((chainId) => getSubgraphSdkByNetwork(chainId, subgraphName))
}
