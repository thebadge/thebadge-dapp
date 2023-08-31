import { useState } from 'react'
import * as React from 'react'

import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'

import TimeAgo from '@/src/components/helpers/TimeAgo'

const LastUpdateTypography = styled(Typography)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '14px !important',
  '&:hover': {
    textDecoration: 'underline',
  },
  cursor: 'pointer',
}))

export default function StatisticsHeader({
  color = colors.purple,
  onClose,
  open,
}: {
  color?: string
  open: boolean
  onClose: VoidFunction
}) {
  const { t } = useTranslation()
  const [lastSearchTimestamp, setLastSearchTimestamp] = useState<number>(dayjs().unix())

  // TODO add refresh logic
  const refresh = () => setLastSearchTimestamp(dayjs().unix())

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
        <Stack my={1}>
          <LastUpdateTypography ml="auto" onClick={refresh}>
            {t('profile.statistics.lastUpdated')}
            <TimeAgo timestamp={lastSearchTimestamp} />
          </LastUpdateTypography>
        </Stack>
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
