import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export const useProtocolStatistic = () => {
  const gql = useSubgraph()
  const { readOnlyChainId } = useWeb3Connection()
  return useSWR(
    [`protocolStatistic:`, readOnlyChainId],
    async () => {
      const protocolStatisticsData = await gql.protocolStatistics()

      return protocolStatisticsData.protocolStatistics[0]
    },
    { revalidateOnMount: true },
  )
}
