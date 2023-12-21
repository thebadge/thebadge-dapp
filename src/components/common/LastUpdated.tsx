import React from 'react'

import SyncIcon from '@mui/icons-material/Sync'
import { Stack, Typography, alpha, styled } from '@mui/material'

import TimeAgo from '@/src/components/helpers/TimeAgo'
import { useSizeSM } from '@/src/hooks/useSize'

const LastUpdateTypography = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '14px !important',
  background: alpha(theme.palette.background.paper, 0.25),
  '&:hover': {
    background: theme.palette.background.paper,
    svg: {
      transitionProperty: 'transform',
      transitionDuration: '0.5s',
      transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
      transform: 'rotate(-180deg)',
    },
  },
  cursor: 'pointer',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(0.5),
}))

type LastUpdatedProps = {
  onClick: VoidFunction
  lastSearchTimestamp?: number
  label: string
}

export default function LastUpdated({ label, lastSearchTimestamp, onClick }: LastUpdatedProps) {
  const isMobile = useSizeSM()
  return (
    <Stack my={1}>
      {isMobile ? (
        <LastUpdateTypography ml="auto" onClick={onClick}>
          <SyncIcon sx={{ width: 16, height: 16 }} />
        </LastUpdateTypography>
      ) : (
        <LastUpdateTypography ml="auto" onClick={onClick}>
          <SyncIcon sx={{ width: 16, height: 16, mr: 0.5 }} />
          {label}
          <TimeAgo timestamp={lastSearchTimestamp} />
        </LastUpdateTypography>
      )}
    </Stack>
  )
}
