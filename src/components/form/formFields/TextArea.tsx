import * as React from 'react'

import { TextField as MUITextField, Stack, styled } from '@mui/material'
import { FieldError } from 'react-hook-form'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

const Wrapper = styled(Stack)(({ theme }) => ({
  position: 'relative',
  rowGap: theme.spacing(1),
}))

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(0),
}))

type TextAreaProps = {
  error?: FieldError
  label?: string
  onChange: (event: any) => void
  placeholder?: string
  rows?: number
  value: string | undefined
}
export function TextArea({ error, label, onChange, placeholder, rows = 3, value }: TextAreaProps) {
  return (
    <Wrapper>
      <StyledTextField
        color="secondary"
        error={!!error}
        helperText={error?.message || ' '}
        label={label}
        multiline
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        sx={{ textTransform: 'capitalize', flex: 1 }}
        value={value ? value : ''}
        variant={'standard'}
      />
    </Wrapper>
  )
}
