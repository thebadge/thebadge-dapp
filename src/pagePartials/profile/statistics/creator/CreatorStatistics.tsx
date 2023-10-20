import { useState } from 'react'
import * as React from 'react'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useStatisticVisibility from '@/src/hooks/nextjs/useStatisticsVisibility'
import StatisticsHeader from '@/src/pagePartials/profile/statistics/addons/StatisticsHeader'
import { StatisticVisibilityToggle } from '@/src/pagePartials/profile/statistics/addons/StatisticsVisibilityToggle'
import CreatorStatisticContent from '@/src/pagePartials/profile/statistics/creator/CreatorStatisticContent'

export enum CreatorStatistic {
  fee = 'Fees collected per badge',
  amount = 'Badge models created ',
  minters = 'Users that minted badges',
  minted = 'Badges minted',
  mostMinted = 'Most popular badge model',
  ranking = 'Position in creators ranking',
}

export const CreatorStatisticDefaultVisibility = {
  [CreatorStatistic.fee]: true,
  [CreatorStatistic.amount]: true,
  [CreatorStatistic.minters]: false,
  [CreatorStatistic.minted]: false,
  [CreatorStatistic.mostMinted]: false,
  [CreatorStatistic.ranking]: false,
}

export default function CreatorStatistics() {
  const { t } = useTranslation()

  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const { statisticVisibility, toggleStatisticVisibility } = useStatisticVisibility(
    'creator',
    CreatorStatisticDefaultVisibility,
  )

  return (
    <Stack gap={2} mb={4}>
      <StatisticsHeader color={'#6F4DF8'} onClose={() => setOpen((prev) => !prev)} open={open} />
      <Box display="flex" justifyContent="space-between">
        <Typography color={colors.purple} fontWeight={700}>
          {t('profile.statistics.creator.title')}
        </Typography>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <AddOutlinedIcon sx={{ color: colors.purple }} />
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
          <CreatorStatisticContent statisticVisibility={statisticVisibility} />
        </SafeSuspense>
      )}
    </Stack>
  )
}
