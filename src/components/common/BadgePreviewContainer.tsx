import React from 'react'

import { Box, Skeleton, styled } from '@mui/material'

export const BadgePreviewContainer = styled(Box, {
  shouldForwardProp: (pN) => pN !== 'highlightColor' && pN !== 'selected',
})<{ highlightColor: string; selected?: boolean }>(({ highlightColor, selected, theme }) => ({
  position: 'relative',
  maxWidth: '250px',
  overflow: 'hidden',
  transition: 'all 0.5s',
  borderRadius: theme.spacing(1),
  borderWidth: '2px',
  padding: theme.spacing(0.5),
  borderColor: 'transparent',
  '&:hover': {
    borderColor: highlightColor,
    scale: '0.98',
    borderRadius: '8px',
  },
  [theme.breakpoints.up('sm')]: {
    ...(selected
      ? {
          borderColor: highlightColor,
          scale: '0.98',
          transition: 'all 1s cubic-bezier(0.65, 0, 0.35, 1)',
        }
      : {}),
  },
  [theme.breakpoints.down('sm')]: {
    scale: '1.3',
  },
}))

export const BadgePreviewLoading = () => (
  <Skeleton animation="wave" height={300} variant="rounded" width={180} />
)
