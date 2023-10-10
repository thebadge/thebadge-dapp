import { useCallback, useState } from 'react'
import * as React from 'react'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useStatisticVisibility from '@/src/hooks/nextjs/useStatisticsVisibility'
import useActionObserver from '@/src/hooks/useActionObserver'
import StatisticsHeader from '@/src/pagePartials/profile/statistics/addons/StatisticsHeader'
import { StatisticVisibilityToggle } from '@/src/pagePartials/profile/statistics/addons/StatisticsVisibilityToggle'
import CuratorStatisticContent from '@/src/pagePartials/profile/statistics/curator/CuratorStatisticContent'

export enum CuratorStatistic {
  amountMade = 'Challenges made',
  amountWon = 'Challenges won ',
  amountLost = 'Challenges lost ',
  percentageWon = '% of challenges won',
  averageFee = 'AVG of fees earned by challenges made',
  ranking = 'Position in curators ranking',
}

export const CuratorStatisticDefaultVisibility = {
  [CuratorStatistic.amountMade]: true,
  [CuratorStatistic.amountWon]: true,
  [CuratorStatistic.amountLost]: false,
  [CuratorStatistic.percentageWon]: false,
  [CuratorStatistic.averageFee]: false,
  [CuratorStatistic.ranking]: false,
}

export default function CuratorStatistics() {
  const { t } = useTranslation()

  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const { trigger, watch } = useActionObserver()
  const { statisticVisibility, toggleStatisticVisibility } = useStatisticVisibility(
    'curator',
    CuratorStatisticDefaultVisibility,
  )

  const refreshHandler = useCallback(async () => {
    trigger()
  }, [trigger])

  return (
    <Stack gap={2} mb={4}>
      <StatisticsHeader
        color={'#6F4DF8'}
        onClose={() => setOpen((prev) => !prev)}
        onRefresh={refreshHandler}
        open={open}
      />
      <Box display="flex" justifyContent="space-between">
        <Typography color={colors.green} fontWeight={700}>
          {t('profile.statistics.curator.title')}
        </Typography>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <AddOutlinedIcon sx={{ color: colors.green }} />
        </IconButton>
        <StatisticVisibilityToggle
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          toggleVisibility={toggleStatisticVisibility}
          visibility={statisticVisibility}
        />
      </Box>
      {open && (
        <SafeSuspense>
          <CuratorStatisticContent
            refreshTrigger={watch}
            statisticVisibility={statisticVisibility}
          />
        </SafeSuspense>
      )}
    </Stack>
  )
}
