import { Box, Stack, alpha, styled } from '@mui/material'

export const StatisticSquare = styled(Stack)<{ color?: string }>(({ color, theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2, 4),
  margin: 'auto',
  height: '100%',
  ...(color && {
    border: `1px solid ${color}`,
    borderRadius: theme.spacing(2),
    background: alpha(color, 0.1),
  }),
}))

export const StatisticsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}))
