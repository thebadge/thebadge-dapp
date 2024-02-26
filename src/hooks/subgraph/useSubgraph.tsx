import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { parsePrefixedAddress } from '@/src/utils/prefixedAddress'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

/**
 *
 * @param subgraphName
 * @param targetContract "chainId:contractAddress"
 */
export default function useSubgraph(
  subgraphName: SubgraphName = SubgraphName.TheBadge,
  targetContract?: string,
) {
  const { readOnlyChainId } = useWeb3Connection()

  if (targetContract) {
    try {
      const { chainId, subgraphName } = parsePrefixedAddress(targetContract)
      return getSubgraphSdkByNetwork(chainId, subgraphName)
    } catch (error) {
      console.error(
        'There was an error parsing the subgraph with the query parameters, returning default values...',
        error,
      )
    }
  }
  return getSubgraphSdkByNetwork(readOnlyChainId, subgraphName)
}
