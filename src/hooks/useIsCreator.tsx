import useSWR from 'swr'

import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export default function useIsCreator() {
  const { address, appChainId } = useWeb3Connection()
  return useSWR(address ? `user:${address}` : null, async (_userAddress: string) => {
    const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
    const userById = await gql.userById({ id: address || '' })

    return !!userById.user?.isCreator
  })
}
