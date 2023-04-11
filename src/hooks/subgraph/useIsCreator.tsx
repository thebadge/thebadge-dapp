import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function useIsCreator(address?: string) {
  const gql = useSubgraph()
  const { address: connectedAddress } = useWeb3Connection()
  return useSWR(
    address || connectedAddress ? `user:${address || connectedAddress}` : null,
    async (_userAddress: string) => {
      const userById = await gql.userById({ id: address || connectedAddress || '' })
      return !!userById.user?.isCreator
    },
  )
}
