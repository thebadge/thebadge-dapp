import { useEffect } from 'react'
import * as React from 'react'

import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined'
import StarBorderPurple500RoundedIcon from '@mui/icons-material/StarBorderPurple500Rounded'
import { Box, Table, TableBody, useTheme } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { StatisticsContainer } from '../addons/styled'
import { StatisticVisibility } from '@/src/hooks/nextjs/useStatisticsVisibility'
import useUserStatistics from '@/src/hooks/subgraph/useUserStatistics'
import StatisticCard from '@/src/pagePartials/profile/statistics/addons/StatisticCard'
import StatisticRow from '@/src/pagePartials/profile/statistics/addons/StatisticRow'
import { UserStatistic } from '@/src/pagePartials/profile/statistics/user/UserStatistics'
import { useProfileProvider } from '@/src/providers/ProfileProvider'
import { timeAgoFrom } from '@/src/utils/dateUtils'

export default function UserStatisticContent({
  statisticVisibility,
}: {
  statisticVisibility: StatisticVisibility
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { refreshWatcher } = useProfileProvider()

  const { data, mutate } = useUserStatistics()
  const userStatistic = data?.userStatistic

  useEffect(() => {
    mutate()
  }, [mutate, refreshWatcher])

  const hasReceivedAnyChallenges =
    userStatistic?.timeOfLastChallengeReceived && userStatistic?.timeOfLastChallengeReceived !== '0'

  return (
    <StatisticsContainer>
      <Table sx={{ width: 'inherit', flex: 3 }}>
        <TableBody>
          <StatisticRow
            color={theme.palette.text.primary}
            icon={<MilitaryTechOutlinedIcon sx={{ color: theme.palette.text.primary }} />}
            label={t('profile.statistics.user.minted')}
            value={`${userStatistic?.mintedBadgesAmount || 0}`}
          />
          <StatisticRow
            color={theme.palette.text.primary}
            icon={<BalanceOutlinedIcon sx={{ color: theme.palette.text.primary }} />}
            label={t('profile.statistics.user.amountChallengesWon')}
            value={`${userStatistic?.challengesReceivedWonAmount || 0}`}
          />
          <StatisticRow
            color={theme.palette.text.primary}
            icon={<CurrencyExchangeIcon sx={{ color: theme.palette.text.primary }} />}
            label={t('profile.statistics.user.amountChallengesReceived')}
            value={`${userStatistic?.challengesReceivedAmount || 0}`}
          />
          <StatisticRow
            color={theme.palette.text.primary}
            icon={<StarBorderPurple500RoundedIcon sx={{ color: theme.palette.text.primary }} />}
            label={t('profile.statistics.user.rankingPosition')}
            value="7"
          />
        </TableBody>
      </Table>

      <Box display="flex" flex="4" gap={2} justifyContent="center">
        {/* TODO Define what we wanto to show, maybe all of the posible statistics */}

        {statisticVisibility[UserStatistic.amountMinted] && (
          <StatisticCard
            icon={
              <EmojiEventsOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.user.minted')}
            value={userStatistic?.mintedBadgesAmount || 0}
          />
        )}

        {statisticVisibility[UserStatistic.amountWithoutChallenge] && (
          <StatisticCard
            icon={
              <BalanceOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={
              hasReceivedAnyChallenges
                ? t('profile.statistics.user.withoutLost')
                : t('profile.statistics.user.neverChallenged')
            }
            value={
              hasReceivedAnyChallenges
                ? timeAgoFrom(userStatistic?.timeOfLastChallengeReceived || 0)
                : undefined
            }
          />
        )}

        {statisticVisibility[UserStatistic.challengesReceivedAmount] && (
          <StatisticCard
            icon={
              <BalanceOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.user.amountChallengesReceived')}
            value={userStatistic?.challengesReceivedAmount || 0}
          />
        )}
      </Box>
    </StatisticsContainer>
  )
}
