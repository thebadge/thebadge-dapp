import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { ChainsValues } from '@/types/chains'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

/**
 *
 * @param subgraphName
 * @param chainIds
 */
export default function useMultiSubgraph(
  subgraphName: SubgraphName = SubgraphName.TheBadge,
  chainIds?: Array<ChainsValues>,
) {
  const { readOnlyChainId } = useWeb3Connection()

  if (chainIds) {
    return chainIds.map((chainId) => getSubgraphSdkByNetwork(chainId, subgraphName))
  } else {
    return [getSubgraphSdkByNetwork(readOnlyChainId, subgraphName)]
  }
}
