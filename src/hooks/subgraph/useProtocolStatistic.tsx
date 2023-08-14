import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export const useProtocolStatistic = () => {
  const { address } = useWeb3Connection()
  const gql = useSubgraph()

  return useSWR(address ? `protocolStatistic:${address}` : null, async (_: string) => {
    const protocolStatisticsData = await gql.protocolStatistics()

    return protocolStatisticsData.protocolStatistics[0]
  })
}
