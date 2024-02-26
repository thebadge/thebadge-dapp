import useSWR from 'swr'

import useGetMultiChainsConfig from '@/src/hooks/subgraph/useGetMultiChainsConfig'
import useMultiSubgraph from '@/src/hooks/subgraph/useMultiSubgraph'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { ProtocolStatistic } from '@/types/generated/subgraph'

export const useProtocolStatistic = () => {
  const { chainIds, isTestnetBased } = useGetMultiChainsConfig()
  const multiSubgraph = useMultiSubgraph(SubgraphName.TheBadge, chainIds)

  return useSWR(
    [`protocolStatistic:`, isTestnetBased ? 'TestnetChains' : 'MainnetChains'],
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
