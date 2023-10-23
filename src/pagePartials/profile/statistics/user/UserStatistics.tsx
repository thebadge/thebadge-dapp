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
import UserStatisticContent from '@/src/pagePartials/profile/statistics/user/UserStatisticContent'

export enum UserStatistic {
  amountMinted = 'mintedBadgesAmount',
  amountWithoutChallenge = 'timeOfLastChallengeReceived',
  amountChallengeLost = 'challengesReceivedLostAmount',
  challengesReceivedAmount = 'challengesReceivedAmount',
}

export const UserStatisticDefaultVisibility = {
  [UserStatistic.amountMinted]: true,
  [UserStatistic.amountWithoutChallenge]: true,
  [UserStatistic.amountChallengeLost]: false,
  // TODO Define what we wanto to show, maybe all of the posible statistics
  // ...CuratorStatisticDefaultVisibility,
  // ...CreatorStatisticDefaultVisibility,
}

export default function UserStatistics() {
  const { t } = useTranslation()

  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const { statisticVisibility, toggleStatisticVisibility } = useStatisticVisibility(
    'user',
    UserStatisticDefaultVisibility,
  )

  return (
    <Stack gap={2} mb={4}>
      <StatisticsHeader color={'#6F4DF8'} onClose={() => setOpen((prev) => !prev)} open={open} />
      <Box display="flex" justifyContent="space-between">
        <Typography color={colors.purple} fontWeight={700}>
          {t('profile.statistics.user.title')}
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
          <UserStatisticContent statisticVisibility={statisticVisibility} />
        </SafeSuspense>
      )}
    </Stack>
  )
}
