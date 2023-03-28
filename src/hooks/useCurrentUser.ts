import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

// @todo (agustin) use SWR
export const useCurrentUser = () => {
  const { address, appChainId } = useWeb3Connection()

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const userById = gql.useUserById({ id: address || '' })

  return userById?.data?.user || null
}
