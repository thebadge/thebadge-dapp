import React from 'react'

import { Typography } from '@mui/material'

export const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <Typography component="span" variant="body1">
      {children}
    </Typography>
  )
}
