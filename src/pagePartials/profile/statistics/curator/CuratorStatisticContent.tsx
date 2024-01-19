import { useEffect } from 'react'
import * as React from 'react'

import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined'
import StarBorderPurple500RoundedIcon from '@mui/icons-material/StarBorderPurple500Rounded'
import { Box, Stack, Table, TableBody, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'

import { StatisticSquare, StatisticsContainer } from '../addons/styled'
import { getNetworkConfig } from '@/src/config/web3'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { StatisticVisibility } from '@/src/hooks/nextjs/useStatisticsVisibility'
import useCuratorStatistics from '@/src/hooks/subgraph/useCuratorStatistics'
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
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.green}>
              <EmojiEventsOutlinedIcon
                sx={{ color: colors.green, position: 'absolute', top: 8, left: 8 }}
              />
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {curatorStatistic?.challengesMadeWonAmount || 0}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                {t('profile.statistics.curator.amountChallengesWon')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[CuratorStatistic.amountMade] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.green}>
              <BalanceOutlinedIcon
                sx={{ color: colors.green, position: 'absolute', top: 8, left: 8 }}
              />
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {curatorStatistic?.challengesMadeAmount || 0}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                {t('profile.statistics.curator.amountChallengesMade')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {/* TODO Create this value on SG -> AVG of fees earned by challenges */}
        {statisticVisibility[CuratorStatistic.averageFee] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.green}>
              <CurrencyExchangeOutlinedIcon
                sx={{ color: colors.green, position: 'absolute', top: 8, left: 8 }}
              />
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {curatorStatistic?.challengesMadeWonAmount || 0}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                {t('profile.statistics.curator.avgFeeWon')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[CuratorStatistic.amountLost] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.green}>
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {curatorStatistic?.challengesMadeLostAmount}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                {t('profile.statistics.curator.amountChallengesLost')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[CuratorStatistic.percentageWon] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.green}>
              <EmojiEventsOutlinedIcon
                sx={{ color: colors.green, position: 'absolute', top: 8, left: 8 }}
              />
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {`${percentage(
                  curatorStatistic?.challengesMadeWonAmount,
                  curatorStatistic?.challengesMadeAmount,
                )}%`}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                {t('profile.statistics.curator.percentageWon')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[CuratorStatistic.ranking] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.green}>
              <MilitaryTechOutlinedIcon sx={{ color: colors.green, fontSize: '4rem' }} />
              <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                {t('profile.statistics.curator.ranking', { position: 7 })}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}
      </Box>
    </StatisticsContainer>
  )
}
