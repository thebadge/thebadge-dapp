import { useState } from 'react'
import * as React from 'react'

import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import { Box, IconButton, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'

import LastUpdated from '@/src/components/common/LastUpdated'
import { useProfileProvider } from '@/src/providers/ProfileProvider'

export default function StatisticsHeader({
  color = colors.purple,
  onClose,
  onRefresh,
  open,
}: {
  color?: string
  open: boolean
  onClose: VoidFunction
  onRefresh?: () => Promise<void>
}) {
  const { t } = useTranslation()
  const { refreshTrigger } = useProfileProvider()

  const [lastSearchTimestamp, setLastSearchTimestamp] = useState<number>(dayjs().unix())

  const refresh = async () => {
    refreshTrigger()
    if (onRefresh) {
      await onRefresh()
    }
    setLastSearchTimestamp(dayjs().unix())
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        borderBottom: `1px solid ${color}`,
        justifyContent: 'space-between',
      }}
    >
      <Box display="flex" gap={1} sx={{ alignContent: 'center', flexWrap: 'wrap' }}>
        <TrendingUpOutlinedIcon sx={{ color, margin: 'auto' }} />
        <Typography color={color} fontWeight={800}>
          {t('profile.statistics.title')}
        </Typography>
      </Box>

      <Box display="flex" gap={1}>
        <LastUpdated
          label={t('profile.statistics.lastUpdated')}
          lastSearchTimestamp={lastSearchTimestamp}
          onClick={refresh}
        />

        <IconButton onClick={onClose}>
          {open ? (
            <ExpandLessOutlinedIcon sx={{ color, margin: 'auto' }} />
          ) : (
            <ExpandMoreOutlinedIcon sx={{ color, margin: 'auto' }} />
          )}
        </IconButton>
      </Box>
    </Box>
  )
}
