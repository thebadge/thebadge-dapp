import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export default function useSubgraph(subgraphName: SubgraphName = SubgraphName.TheBadge) {
  const { appChainId } = useWeb3Connection()
  return getSubgraphSdkByNetwork(appChainId, subgraphName)
}
