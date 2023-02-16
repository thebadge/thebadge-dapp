import React from 'react'

import { Typography } from '@mui/material'

export const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <Typography
      component="span"
      sx={{
        display: 'inline-flex',
        alignContent: 'center',
        flexWrap: 'wrap',
      }}
      variant="body1"
    >
      {children}
    </Typography>
  )
}
