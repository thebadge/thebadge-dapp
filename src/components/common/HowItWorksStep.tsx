import React from 'react'

import { Box, Typography } from '@mui/material'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'

export default function HowItWorksStep({ index, text }: { index: string | number; text: string }) {
  return (
    <Box display="flex" gap={1}>
      <Typography variant="titleLarge">{index}.</Typography>
      <MarkdownTypography
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
        variant="bodySmall"
      >
        {text}
      </MarkdownTypography>
    </Box>
  )
}
