import { Box, Stack, Typography, alpha, styled } from '@mui/material'

import StatisticCounterUp from '@/src/pagePartials/home/statistics/StatisticCounterUp'

const StatisticContainer = styled(Stack)<{ transparent?: boolean }>(({ theme, transparent }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: transparent ? 'transparent' : alpha('#0D0D0D', 0.7),
  whiteSpace: 'break-spaces',
}))

export default function StatisticDoubleDisplay({
  primaryLabel,
  primaryNumber,
  secondaryLabel,
  secondaryNumber,
  transparent,
}: {
  primaryLabel: string
  secondaryLabel: string
  primaryNumber: number
  secondaryNumber: number
  transparent?: boolean
}) {
  return (
    <StatisticContainer sx={{ py: 0 }} transparent={transparent}>
      <Box alignItems="center" display="flex" gap={2}>
        <StatisticCounterUp
          number={primaryNumber}
          sx={{ color: transparent ? 'black' : undefined }}
        />
        <Typography
          color="black"
          component="div"
          lineHeight="110%"
          textTransform="uppercase"
          variant="dAppTitle2"
        >
          {primaryLabel}
        </Typography>
      </Box>
      <Box alignItems="center" display="flex" gap={2}>
        <StatisticCounterUp
          number={secondaryNumber}
          sx={{ color: transparent ? 'black' : undefined }}
        />
        <Typography
          color="black"
          component="div"
          lineHeight="110%"
          textTransform="uppercase"
          variant="dAppTitle2"
        >
          {secondaryLabel}
        </Typography>
      </Box>
    </StatisticContainer>
  )
}
