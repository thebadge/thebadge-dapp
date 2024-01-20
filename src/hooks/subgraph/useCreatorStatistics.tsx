import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function useCreatorStatistics() {
  const { address, readOnlyChainId } = useWeb3Connection()

  const gql = useSubgraph()
  return useSWR(
    address ? [`creatorStatistics`, address, readOnlyChainId] : null,
    ([, _address]) => {
      return gql.creatorStatistics({ address: _address })
    },
    { revalidateOnMount: true },
  )
}
