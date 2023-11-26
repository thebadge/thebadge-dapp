import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useChainId from '@/src/hooks/theBadge/useChainId'

export const useProtocolStatistic = () => {
  const gql = useSubgraph()
  const chainId = useChainId()
  return useSWR(
    [`protocolStatistic:`, chainId],
    async () => {
      const protocolStatisticsData = await gql.protocolStatistics()

      return protocolStatisticsData.protocolStatistics[0]
    },
    { revalidateOnMount: true },
  )
}
