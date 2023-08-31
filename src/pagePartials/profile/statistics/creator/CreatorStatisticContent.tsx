import * as React from 'react'

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined'
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined'
import StarBorderPurple500RoundedIcon from '@mui/icons-material/StarBorderPurple500Rounded'
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined'
import { Box, Stack, Table, TableBody, Typography, alpha, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'

import { getNetworkConfig } from '@/src/config/web3'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { StatisticVisibility } from '@/src/hooks/nextjs/useStatisticsVisibility'
import useCreatorStatistics from '@/src/hooks/subgraph/useCreatorStatistics'
import StatisticRow from '@/src/pagePartials/profile/statistics/addons/StatisticRow'
import { CreatorStatistic } from '@/src/pagePartials/profile/statistics/creator/CreatorStatistics'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const StatisticSquare = styled(Stack)<{ color?: string }>(({ color, theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2, 4),
  margin: 'auto',
  height: '100%',
  ...(color && {
    border: `1px solid ${color}`,
    borderRadius: theme.spacing(2),
    background: alpha(color, 0.1),
  }),
}))

const StatisticsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}))
export default function CreatorStatisticContent({
  statisticVisibility,
}: {
  statisticVisibility: StatisticVisibility
}) {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)

  const statistics = useCreatorStatistics()

  const creatorStatistic = statistics.data?.creatorStatistic

  return (
    <StatisticsContainer>
      <Table sx={{ width: 'inherit', flex: 3 }}>
        <TableBody>
          <StatisticRow
            color={colors.purple}
            icon={<MilitaryTechOutlinedIcon sx={{ color: colors.purple }} />}
            label={t('profile.statistics.creator.amountModelCreated')}
            value={`${creatorStatistic?.createdBadgeModelsAmount || 0}`}
          />
          <StatisticRow
            color={colors.purple}
            icon={<EmojiEmotionsOutlinedIcon sx={{ color: colors.purple }} />}
            label={t('profile.statistics.creator.uniqueMinters')}
            value={`${creatorStatistic?.allTimeBadgeMintersAmount || 0}`}
          />
          <StatisticRow
            color={colors.purple}
            icon={<CurrencyExchangeIcon sx={{ color: colors.purple }} />}
            label={t('profile.statistics.creator.totalEarned')}
            value={`${formatUnits(creatorStatistic?.totalFeesEarned || ZERO_BN)} ${
              networkConfig.token
            }`}
          />
          <StatisticRow
            color={colors.purple}
            icon={<StarBorderPurple500RoundedIcon sx={{ color: colors.purple }} />}
            label={t('profile.statistics.creator.rankingPosition')}
            value="7"
          />
        </TableBody>
      </Table>

      <Box display="flex" flex="4" gap={2} justifyContent="center">
        {statisticVisibility[CreatorStatistic.fee] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.purple}>
              <TroubleshootOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {formatUnits(
                  BigNumber.from(creatorStatistic?.totalFeesEarned || ZERO_BN).div(
                    creatorStatistic?.createdBadgeModelsMintedAmount || 1,
                  ),
                )}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>
                Fees collected <br /> per badge
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[CreatorStatistic.amount] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.purple}>
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {creatorStatistic?.createdBadgeModelsAmount}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: colors.purple }}>
                {t('profile.statistics.creator.amountModelCreated')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[CreatorStatistic.minters] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.purple}>
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {creatorStatistic?.mostPopularCreatedBadge}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: colors.purple }}>
                {t('profile.statistics.creator.amountOfMinters')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[CreatorStatistic.minted] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.purple}>
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {creatorStatistic?.createdBadgeModelsMintedAmount}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: colors.purple }}>
                {t('profile.statistics.creator.totalMinted')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[CreatorStatistic.mostMinted] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.purple}>
              <Typography sx={{ fontSize: '48px !important', fontWeight: 900 }}>
                {creatorStatistic?.mostPopularCreatedBadge}
              </Typography>
              <Typography sx={{ textAlign: 'center', color: colors.purple }}>
                {t('profile.statistics.creator.mostMinted')}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}

        {statisticVisibility[CreatorStatistic.ranking] && (
          <Stack flex="1" minWidth="160px">
            <StatisticSquare color={colors.purple}>
              <MilitaryTechOutlinedIcon sx={{ color: colors.purple, fontSize: '4rem' }} />
              <Typography sx={{ textAlign: 'center', color: colors.purple }}>
                {t('profile.statistics.creator.ranking', { position: 7 })}
              </Typography>
            </StatisticSquare>
          </Stack>
        )}
      </Box>
    </StatisticsContainer>
  )
}
