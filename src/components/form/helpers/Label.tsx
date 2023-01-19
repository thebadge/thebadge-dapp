import React from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { useColorMode } from '@/src/providers/themeProvider'

export const Label = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useColorMode()
  return (
    <Typography
      color={mode === 'light' ? colors.dark : colors.white}
      component="span"
      variant="body1"
    >
      {children}
    </Typography>
  )
}
