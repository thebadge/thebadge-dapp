import useSWR, { SWRResponse } from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function useIsRegistered(address?: string): SWRResponse<boolean> {
  const gql = useSubgraph()
  const { address: connectedAddress, readOnlyChainId } = useWeb3Connection()
  return useSWR(
    address || connectedAddress
      ? [`isRegistered:${address || connectedAddress}`, readOnlyChainId]
      : null,
    async () => {
      const userById = await gql.userById({ id: address || connectedAddress || '' })
      return !!userById.user?.isRegistered
    },
    {
      revalidateOnFocus: true,
    },
  )
}
