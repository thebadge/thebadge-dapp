import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { User } from '@/types/generated/subgraph'
import { WCAddress } from '@/types/utils'

export const useUserById = (address: WCAddress | undefined, targetContract?: string) => {
  const gql = useSubgraph(SubgraphName.TheBadge, targetContract)
  const { readOnlyChainId } = useWeb3Connection()

  return useSWR(
    address ? [`user:${address}`, address, readOnlyChainId, targetContract] : null,
    async ([, _address]) => {
      const userById = await gql.userById({ id: _address })

      // We need to return an empty object as a User, if not the result from the subgraph is null and SWR will
      // keep the suspense no matter what, bc its thinks that the promise is not resolved yet
      return userById.user || ({} as User)
    },
  )
}
