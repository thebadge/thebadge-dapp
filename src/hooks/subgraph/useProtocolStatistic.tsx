import useSWR from 'swr'

import { MainnetChains, TestnetChains } from '@/src/config/web3'
import useMultiSubgraph from '@/src/hooks/subgraph/useMultiSubgraph'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { ProtocolStatistic } from '@/types/generated/subgraph'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export const useProtocolStatistic = () => {
  const { readOnlyChainId } = useWeb3Connection()
  const testnetStatistics = TestnetChains.includes(readOnlyChainId)
  const chainIds = testnetStatistics ? TestnetChains : MainnetChains
  const multiSubgraph = useMultiSubgraph(SubgraphName.TheBadge, chainIds)

  return useSWR(
    [`protocolStatistic:`, testnetStatistics ? 'TestnetChains' : 'MainnetChains'],
    async () => {
      const protocolStatisticsResponses = await Promise.all(
        multiSubgraph.map((gql) => gql.protocolStatistics()),
      )

      let protocolStatisticsData = {
        badgeCreatorsAmount: 0,
        badgeCuratorsAmount: 0,
        badgeModelsCreatedAmount: 0,
        badgesChallengedAmount: 0,
        badgesMintedAmount: 0,
        badgesOwnersAmount: 0,
      } as ProtocolStatistic

      // For each network we summarise all the values
      protocolStatisticsResponses.forEach((r) => {
        /**
         * "ProtocolStatistic"
         * badgeCreatorsAmount: string;
         * badgeCuratorsAmount: string;
         * badgeModelsCreatedAmount: string;
         * badgesChallengedAmount: string;
         * badgesMintedAmount: string;
         * badgesOwnersAmount: string;
         */
        const data = r.protocolStatistics[0] as ProtocolStatistic
        Object.keys(data).map((statisticKeys) => {
          protocolStatisticsData = {
            ...protocolStatisticsData,
            [statisticKeys]:
              Number(protocolStatisticsData[statisticKeys as keyof ProtocolStatistic]) +
              Number(data[statisticKeys as keyof ProtocolStatistic]),
          }
        })
      })

      return protocolStatisticsData
    },
    { revalidateOnMount: true },
  )
}
