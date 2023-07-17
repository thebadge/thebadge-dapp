import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { User } from '@/types/generated/subgraph'

export const useCurrentUser = () => {
  const { address } = useWeb3Connection()
  const gql = useSubgraph()
  return useSWR(address ? `user:${address}` : null, async (_userAddress: string) => {
    const userById = await gql.userById({ id: address || '' })
    // We need to return an empty object as an User, if not the result from the subgraph is null and SWR will
    // keep the suspense no matter what, bc its thinks that the promise is not resolved yet
    return userById.user || ({} as User)
  })
}
