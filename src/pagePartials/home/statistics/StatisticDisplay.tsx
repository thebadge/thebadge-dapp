import { Stack, Typography, alpha, styled } from '@mui/material'

import StatisticCounterUp from '@/src/pagePartials/home/statistics/StatisticCounterUp'

const StatisticContainer = styled(Stack)<{ transparent?: boolean }>(({ theme, transparent }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: transparent ? 'transparent' : alpha('#0D0D0D', 0.7),
  whiteSpace: 'break-spaces',
}))

export default function StatisticDisplay({
  label,
  number,
  transparent,
}: {
  label: string
  number: number
  transparent?: boolean
}) {
  // The use of 'background.default' guarantee the black on dark theme and white on light theme
  return (
    <StatisticContainer transparent={transparent}>
      <StatisticCounterUp
        number={number}
        sx={{ color: transparent ? 'background.default' : 'text.primary' }}
      />
      <Typography
        color={transparent ? 'background.default' : 'text.primary'}
        textTransform="uppercase"
        variant="dAppTitle2"
      >
        {label}
      </Typography>
    </StatisticContainer>
  )
}
