import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'

import { StatisticSquare } from './styled'

export default function StatisticCard({
  color = colors.purple,
  icon,
  label,
  maxLenghtDisplayed = 6,
  minWidth = '160px',
  value,
}: {
  icon?: React.ReactNode
  color?: string
  label: string
  value?: string | number
  maxLenghtDisplayed?: number
  minWidth?: string
}) {
  // 0.0000 as max displayed
  const truncatedValue = value?.toString().slice(0, maxLenghtDisplayed)
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

function getFrontSize(lenght: number) {
  console.log('getFontSize', lenght)
  let fontSize = 48
  if (lenght >= 5 && lenght <= 7) {
    fontSize = 38
  } else if (lenght > 8 && lenght <= 12) {
    fontSize = 32
  } else if (lenght > 12 && lenght <= 15) {
    fontSize = 26
  } else if (lenght > 15 && lenght <= 19) {
    fontSize = 22
  } else if (lenght >= 20) {
    fontSize = 18
  }
  return `${fontSize}px !important`
}
