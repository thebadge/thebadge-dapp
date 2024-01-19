import React from 'react'

import { Box, Skeleton, alpha, styled } from '@mui/material'

export const MiniBadgePreviewContainer = styled(Box, {
  shouldForwardProp: (pN) => pN !== 'highlightColor' && pN !== 'selected',
})<{ highlightColor: string; selected?: boolean }>(({ highlightColor, selected, theme }) => ({
  position: 'relative',
  maxWidth: '250px',
  overflow: 'hidden',
  transition: 'all 0.5s',
  borderRadius: theme.spacing(1),
  '&:hover': {
    background: alpha(highlightColor, 0.2),
    scale: '0.98',
    borderRadius: '8px',
  },
  ...(selected
    ? {
        background: alpha(highlightColor, 0.25),
        scale: '0.98',
        transition: 'all 1s cubic-bezier(0.65, 0, 0.35, 1)',
      }
    : {}),
  [theme.breakpoints.down('sm')]: {
    scale: '1.3',
  },
}))

export const MiniBadgePreviewLoading = ({ height, width }: { height?: number; width?: number }) => (
  <Skeleton animation="wave" height={height || 300} variant="rounded" width={width || 180} />
)
