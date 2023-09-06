import * as React from 'react'

import { TableCell, TableRow, Typography, alpha, styled } from '@mui/material'

const StatisticLabel = styled(Typography)(() => ({
  display: 'inline-flex',
  textAlign: 'left',
  fontSize: '14px !important',
  fontWeight: 300,
}))

const StatisticValue = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  textAlign: 'right',
  fontSize: '16px !important',
  fontWeight: 700,
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px !important',
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    background: alpha(theme.palette.grey[700], 0.25),
  },
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}))

export default function StatisticRow({
  color,
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  color: string
  label: string
  value: string
}) {
  return (
    <StyledTableRow>
      <StyledTableCell size="small" sx={{ borderBottom: `1px solid ${alpha(color, 0.6)}` }}>
        {icon}
      </StyledTableCell>
      <StyledTableCell size="medium" sx={{ borderBottom: `1px solid ${alpha(color, 0.6)}` }}>
        <StatisticLabel>{label}</StatisticLabel>
      </StyledTableCell>
      <StyledTableCell size="small" sx={{ borderBottom: `1px solid ${alpha(color, 0.6)}` }}>
        <StatisticValue sx={{ color }}>{value}</StatisticValue>
      </StyledTableCell>
    </StyledTableRow>
  )
}
