import useSWR, { SWRResponse } from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export const useIsRegistered = (address?: string): SWRResponse<boolean> => {
  const gql = useSubgraph()
  const { address: connectedAddress, readOnlyChainId } = useWeb3Connection()
  return useSWR(
    [`isRegistered:${address || connectedAddress}`, readOnlyChainId],
    async () => {
      if (!address && !connectedAddress) {
        return false
      }
      const userById = await gql.userById({ id: address || connectedAddress || '' })
      return !!userById.user?.isRegistered
    },
    {
      revalidateOnFocus: true,
    },
  )
}
