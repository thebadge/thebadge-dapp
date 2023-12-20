import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function useCuratorStatistics() {
  const { address, readOnlyChainId } = useWeb3Connection()

  const gql = useSubgraph()
  return useSWR(
    address ? [`curatorStatistics`, address, readOnlyChainId] : null,
    ([, _address]) => {
      return gql.curatorStatistics({ address: _address })
    },
    { revalidateOnMount: true },
  )
}
