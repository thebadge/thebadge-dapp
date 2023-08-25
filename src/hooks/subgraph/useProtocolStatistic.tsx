import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'

export const useProtocolStatistic = () => {
  const gql = useSubgraph()

  return useSWR([`protocolStatistic:`], async () => {
    const protocolStatisticsData = await gql.protocolStatistics()

    return protocolStatisticsData.protocolStatistics[0]
  })
}
