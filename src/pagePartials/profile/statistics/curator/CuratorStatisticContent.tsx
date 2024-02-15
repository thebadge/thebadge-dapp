import { useEffect } from 'react'
import * as React from 'react'

import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined'
import StarBorderPurple500RoundedIcon from '@mui/icons-material/StarBorderPurple500Rounded'
import { Box, Table, TableBody } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'

import { StatisticsContainer } from '../addons/styled'
import { getNetworkConfig } from '@/src/config/web3'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { StatisticVisibility } from '@/src/hooks/nextjs/useStatisticsVisibility'
import useCuratorStatistics from '@/src/hooks/subgraph/useCuratorStatistics'
import StatisticCard from '@/src/pagePartials/profile/statistics/addons/StatisticCard'
import StatisticRow from '@/src/pagePartials/profile/statistics/addons/StatisticRow'
import { CuratorStatistic } from '@/src/pagePartials/profile/statistics/curator/CuratorStatistics'
import { useProfileProvider } from '@/src/providers/ProfileProvider'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { percentage } from '@/src/utils/numbers'

export default function CuratorStatisticContent({
  statisticVisibility,
}: {
  statisticVisibility: StatisticVisibility
}) {
  const { t } = useTranslation()
  const { readOnlyChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(readOnlyChainId)
  const { refreshWatcher } = useProfileProvider()

  const { data, mutate } = useCuratorStatistics()

  const curatorStatistic = data?.curatorStatistic

  useEffect(() => {
    mutate()
  }, [mutate, refreshWatcher])

  return (
    <StatisticsContainer>
      <Table sx={{ width: 'inherit', flex: 3 }}>
        <TableBody>
          <StatisticRow
            color={colors.green}
            icon={<BalanceOutlinedIcon sx={{ color: colors.green }} />}
            label={t('profile.statistics.curator.amountChallengesMade')}
            value={`${curatorStatistic?.challengesMadeAmount || 0}`}
          />
          <StatisticRow
            color={colors.green}
            icon={<MilitaryTechOutlinedIcon sx={{ color: colors.green }} />}
            label={t('profile.statistics.curator.amountChallengesWon')}
            value={`${curatorStatistic?.challengesMadeWonAmount || 0}`}
          />
          {/* TODO Create this value on SG -> AVG of fees earned by challenges */}
          <StatisticRow
            color={colors.green}
            icon={<CurrencyExchangeIcon sx={{ color: colors.green }} />}
            label={t('profile.statistics.curator.avgFeeWon')}
            value={`${formatUnits(curatorStatistic?.challengesMadeWonAmount || ZERO_BN)} ${
              networkConfig.token
            }`}
          />
          <StatisticRow
            color={colors.green}
            icon={<StarBorderPurple500RoundedIcon sx={{ color: colors.green }} />}
            label={t('profile.statistics.curator.rankingPosition')}
            value="7"
          />
        </TableBody>
      </Table>

      <Box display="flex" flex="4" gap={2} justifyContent="center">
        {statisticVisibility[CuratorStatistic.amountWon] && (
          <StatisticCard
            icon={
              <EmojiEventsOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.curator.amountChallengesWon')}
            value={curatorStatistic?.challengesMadeWonAmount || 0}
          />
        )}

        {statisticVisibility[CuratorStatistic.amountMade] && (
          <StatisticCard
            icon={
              <BalanceOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.curator.amountChallengesMade')}
            value={curatorStatistic?.challengesMadeAmount || 0}
          />
        )}

        {/* TODO Create this value on SG -> AVG of fees earned by challenges */}
        {statisticVisibility[CuratorStatistic.averageFee] && (
          <StatisticCard
            icon={
              <CurrencyExchangeOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.curator.avgFeeWon')}
            value={curatorStatistic?.challengesMadeWonAmount || 0}
          />
        )}

        {statisticVisibility[CuratorStatistic.amountLost] && (
          <StatisticCard
            label={t('profile.statistics.curator.amountChallengesLost')}
            value={curatorStatistic?.challengesMadeLostAmount || 0}
          />
        )}

        {statisticVisibility[CuratorStatistic.percentageWon] && (
          <StatisticCard
            icon={
              <EmojiEventsOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.curator.percentageWon')}
            value={`${percentage(
              curatorStatistic?.challengesMadeWonAmount,
              curatorStatistic?.challengesMadeAmount,
            )}%`}
          />
        )}

        {statisticVisibility[CuratorStatistic.ranking] && (
          <StatisticCard
            icon={
              <MilitaryTechOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.curator.ranking', { position: 7 })}
          />
        )}
      </Box>
    </StatisticsContainer>
  )
}
