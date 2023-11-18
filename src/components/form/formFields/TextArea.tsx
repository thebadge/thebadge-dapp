import * as React from 'react'

import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps,
  styled,
} from '@mui/material'
import { FieldError } from 'react-hook-form'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(0),
}))

type TextAreaProps = Omit<MUITextFieldProps, 'error' | 'onChange'> & {
  error?: FieldError
  label?: string
  onChange: (event: any) => void
  placeholder?: string
  rows?: number
  value: string | undefined
}
export function TextArea({
  error,
  label,
  onChange,
  placeholder,
  rows = 3,
  value,
  ...props
}: TextAreaProps) {
  return (
    <StyledTextField
      color="secondary"
      error={!!error}
      helperText={error?.message || ' '}
      label={label}
      multiline
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      sx={{ flex: 1 }}
      value={value ? value : ''}
      variant={'standard'}
      {...props}
    />
  )
}
