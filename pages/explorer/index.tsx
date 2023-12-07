import React, { useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import ExploreBadgeModels from '@/src/pagePartials/explorer/badgeModel'
import ExploreBadges from '@/src/pagePartials/explorer/badges'
import { NextPageWithLayout } from '@/types/next'

enum AvailableExplorers {
  Badges = 'badges',
  Models = 'models',
}

const Explorer: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const [selectedExplorer, setSelectedExplorer] = useState<AvailableExplorers>(
    AvailableExplorers.Models,
  )

  const modelsExplorerTab = (
    <Typography
      color={selectedExplorer === AvailableExplorers.Models ? 'text.primary' : 'text.disabled'}
      onClick={() => setSelectedExplorer(AvailableExplorers.Models)}
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
      }}
      textTransform="uppercase"
    >
      {t('explorer.badgeModels.tabTitle')}
    </Typography>
  )

  const badgesExplorerTab = (
    <Typography
      color={selectedExplorer === AvailableExplorers.Badges ? 'text.primary' : 'text.disabled'}
      onClick={() => setSelectedExplorer(AvailableExplorers.Badges)}
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
      }}
      textTransform="uppercase"
    >
      {t('explorer.badges.tabTitle')}
    </Typography>
  )

  return (
    <SafeSuspense>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Box display="flex" flex={1} flexDirection="row" justifyContent="space-evenly" width="100%">
          {modelsExplorerTab}
          {badgesExplorerTab}
        </Box>
      </Stack>
      {selectedExplorer === AvailableExplorers.Models && <ExploreBadgeModels />}
      {selectedExplorer === AvailableExplorers.Badges && <ExploreBadges />}
    </SafeSuspense>
  )
}

export default withPageGenericSuspense(Explorer, { spinner: { color: 'blue' } })
