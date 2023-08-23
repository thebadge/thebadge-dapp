import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Typography, styled } from '@mui/material'

const HintContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flex: '1',
  gap: theme.spacing(2),
  border: '1px solid grey',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  opacity: 0.6,
  '&:hover': {
    opacity: 1,
  },
}))

export function TSFormFieldHint({ label }: { label?: string }) {
  return (
    <HintContainer>
      <InfoOutlinedIcon />
      <Typography>{label}</Typography>
    </HintContainer>
  )
}
