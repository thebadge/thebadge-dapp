import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useChainId from '@/src/hooks/theBadge/useChainId'
import { User } from '@/types/generated/subgraph'

export const useUserById = (address: `0x${string}`) => {
  const gql = useSubgraph()
  const chainId = useChainId()
  return useSWR(address ? [`user:${address}`, address, chainId] : null, async () => {
    const userById = await gql.userById({ id: address || '' })
    // We need to return an empty object as a User, if not the result from the subgraph is null and SWR will
    // keep the suspense no matter what, bc its thinks that the promise is not resolved yet
    return userById.user || ({} as User)
  })
}
