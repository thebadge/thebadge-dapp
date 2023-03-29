import * as React from 'react'

import { Box, TextField as MUITextField, styled } from '@mui/material'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  gridColumn: 'auto',
}))

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(0),
}))

type DisplayLongTextProps = {
  label?: string
  placeholder?: string
  value: string | undefined
}
export function DisplayLongText({ label, placeholder, value }: DisplayLongTextProps) {
  return (
    <Wrapper>
      <StyledTextField
        color="secondary"
        contentEditable={false}
        label={label}
        multiline
        placeholder={placeholder}
        rows={3}
        sx={{ textTransform: 'capitalize', flex: 1 }}
        value={value ? value : ''}
        variant={'standard'}
      />
    </Wrapper>
  )
}
