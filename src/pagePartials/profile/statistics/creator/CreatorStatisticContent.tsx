import { useEffect } from 'react'
import * as React from 'react'

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined'
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined'
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import StarBorderPurple500RoundedIcon from '@mui/icons-material/StarBorderPurple500Rounded'
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined'
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined'
import { Box, Table, TableBody } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'

import { StatisticsContainer } from '../addons/styled'
import { getNetworkConfig } from '@/src/config/web3'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { StatisticVisibility } from '@/src/hooks/nextjs/useStatisticsVisibility'
import useCreatorStatistics from '@/src/hooks/subgraph/useCreatorStatistics'
import StatisticCard from '@/src/pagePartials/profile/statistics/addons/StatisticCard'
import StatisticRow from '@/src/pagePartials/profile/statistics/addons/StatisticRow'
import { CreatorStatistic } from '@/src/pagePartials/profile/statistics/creator/CreatorStatistics'
import { useProfileProvider } from '@/src/providers/ProfileProvider'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function CreatorStatisticContent({
  statisticVisibility,
}: {
  statisticVisibility: StatisticVisibility
}) {
  const { t } = useTranslation()
  const { readOnlyChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(readOnlyChainId)
  const { refreshWatcher } = useProfileProvider()

  const { data, mutate } = useCreatorStatistics()
  const creatorStatistic = data?.creatorStatistic

  useEffect(() => {
    mutate()
  }, [mutate, refreshWatcher])

  return (
    <StatisticsContainer>
      <Table sx={{ width: 'inherit', flex: 3 }}>
        <TableBody>
          <StatisticRow
            color={colors.purple}
            icon={<MilitaryTechOutlinedIcon sx={{ color: colors.purple }} />}
            label={t('profile.statistics.creator.amountModelsCreated')}
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
          <StatisticCard
            icon={
              <TroubleshootOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.creator.earnedPerModel')}
            value={formatUnits(
              BigNumber.from(creatorStatistic?.totalFeesEarned || ZERO_BN).div(
                creatorStatistic?.createdBadgeModelsMintedAmount > 0
                  ? creatorStatistic?.createdBadgeModelsMintedAmount
                  : 1,
              ),
            )}
          />
        )}

        {statisticVisibility[CreatorStatistic.amount] && (
          <StatisticCard
            icon={
              <StickyNote2OutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.creator.amountModelsCreated')}
            value={creatorStatistic?.createdBadgeModelsAmount || 0}
          />
        )}

        {statisticVisibility[CreatorStatistic.minters] && (
          <StatisticCard
            icon={
              <PeopleOutlineOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.creator.amountOfMinters')}
            value={creatorStatistic?.mostPopularCreatedBadge}
          />
        )}

        {statisticVisibility[CreatorStatistic.minted] && (
          <StatisticCard
            label={t('profile.statistics.creator.totalMinted')}
            value={creatorStatistic?.createdBadgeModelsMintedAmount}
          />
        )}

        {statisticVisibility[CreatorStatistic.mostMinted] && (
          <StatisticCard
            icon={
              <LocalFireDepartmentOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.creator.mostMinted')}
            value={creatorStatistic?.mostPopularCreatedBadge}
          />
        )}

        {statisticVisibility[CreatorStatistic.ranking] && (
          <StatisticCard
            icon={
              <MilitaryTechOutlinedIcon
                sx={{ color: colors.purple, position: 'absolute', top: 8, left: 8 }}
              />
            }
            label={t('profile.statistics.creator.ranking', { position: 7 })}
          />
        )}
      </Box>
    </StatisticsContainer>
  )
}
