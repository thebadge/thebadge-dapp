import * as React from 'react'

import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined'
import StarBorderPurple500RoundedIcon from '@mui/icons-material/StarBorderPurple500Rounded'
import { Box, Stack, Table, TableBody, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { StatisticSquare, StatisticsContainer } from '../addons/styled'
import { StatisticVisibility } from '@/src/hooks/nextjs/useStatisticsVisibility'
import useUserStatistics from '@/src/hooks/subgraph/useUserrStatistics'
import StatisticRow from '@/src/pagePartials/profile/statistics/addons/StatisticRow'
import { UserStatistic } from '@/src/pagePartials/profile/statistics/user/UserStatistics'
import { timeAgoFrom } from '@/src/utils/dateUtils'
export default function UserStatisticContent({
  statisticVisibility,
}: {
  statisticVisibility: StatisticVisibility
}) {
  const { t } = useTranslation()
  const theme = useTheme()

  const statistics = useUserStatistics()

  const userStatistic = statistics.data?.userStatistic

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
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={theme.palette.text.primary}>
              <EmojiEventsOutlinedIcon
                sx={{ color: theme.palette.text.primary, position: 'absolute', top: 8, left: 8 }}
              />
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {userStatistic?.mintedBadgesAmount || 0}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                {t('profile.statistics.user.minted')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[UserStatistic.amountWithoutChallenge] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={theme.palette.text.primary}>
              <BalanceOutlinedIcon
                sx={{ color: theme.palette.text.primary, position: 'absolute', top: 8, left: 8 }}
              />
              {userStatistic?.challengesReceivedAmount > 0 &&
              userStatistic?.timeOfLastChallengeReceived ? (
                <>
                  <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                    {timeAgoFrom(userStatistic?.timeOfLastChallengeReceived || 0)}
                  </Typography>
                  <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                    {t('profile.statistics.user.withoutLost')}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>0</Typography>
                  <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                    {t('profile.statistics.user.amountChallengesReceived')}
                  </Typography>
                </>
              )}
            </StatisticSquare>
          </Stack>
        )}
      </Box>
    </StatisticsContainer>
  )
}
