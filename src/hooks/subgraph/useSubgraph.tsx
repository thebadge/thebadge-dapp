import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { parsePrefixedAddress } from '@/src/utils/prefixedAddress'

export default function useSubgraph(
  subgraphName: SubgraphName = SubgraphName.TheBadge,
  targetContract?: string,
) {
  const { appChainId } = useWeb3Connection()
  if (!targetContract) {
    return getSubgraphSdkByNetwork(appChainId, subgraphName)
  }
  try {
    const { chainId, subgraphName } = parsePrefixedAddress(targetContract)

    return getSubgraphSdkByNetwork(chainId, subgraphName)
  } catch (error) {
    console.error(
      'There was an error parsing the subgraph with the query parameters, returning default values...',
    )
    return getSubgraphSdkByNetwork(appChainId, subgraphName)
  }
}
