import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { parsePrefixedAddress } from '@/src/utils/prefixedAddress'

const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function useSubgraph(
  subgraphName: SubgraphName = SubgraphName.TheBadge,
  targetContract?: string,
) {
  const { readOnlyChainId } = useWeb3Connection()
  if (!targetContract) {
    return getSubgraphSdkByNetwork(readOnlyChainId, subgraphName)
  }
  try {
    const { chainId, subgraphName } = parsePrefixedAddress(targetContract)

    return getSubgraphSdkByNetwork(chainId, subgraphName)
  } catch (error) {
    console.error(
      'There was an error parsing the subgraph with the query parameters, returning default values...',
    )
    return getSubgraphSdkByNetwork(readOnlyChainId, subgraphName)
  }
}
