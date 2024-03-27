import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'

import { StatisticSquare } from './styled'

export default function StatisticCard({
  color = colors.purple,
  icon,
  label,
  maxLengthDisplayed = 9,
  minWidth = '160px',
  value,
}: {
  icon?: React.ReactNode
  color?: string
  label: string
  value?: string | number
  maxLengthDisplayed?: number
  minWidth?: string
}) {
  // 0.0000 as max displayed
  const truncatedValue = value?.toString().slice(0, maxLengthDisplayed)
  return (
    <Stack flex="1" minWidth={minWidth}>
      <StatisticSquare color={color}>
        {icon}
        {truncatedValue && (
          <Typography sx={{ fontSize: getFrontSize(truncatedValue.length), fontWeight: 900 }}>
            {truncatedValue}
          </Typography>
        )}
        <Typography sx={{ textAlign: 'center', color: 'text.primary' }}>{label}</Typography>
      </StatisticSquare>
    </Stack>
  )
}

function getFrontSize(length: number) {
  let fontSize = 48
  if (length >= 5 && length <= 7) {
    fontSize = 38
  } else if (length > 8 && length <= 12) {
    fontSize = 32
  } else if (length > 12 && length <= 15) {
    fontSize = 26
  } else if (length > 15 && length <= 19) {
    fontSize = 22
  } else if (length >= 20) {
    fontSize = 18
  }
  return `${fontSize}px !important`
}
