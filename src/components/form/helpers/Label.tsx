import React from 'react'

import { Typography } from '@mui/material'

import { useColorMode } from '@/src/providers/themeProvider'

export const Label = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useColorMode()
  return (
    <Typography
      color={mode === 'dark' ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)'}
      component="span"
      variant="body1"
    >
      {children}
    </Typography>
  )
}
