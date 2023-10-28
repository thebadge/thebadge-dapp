import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps,
  Tooltip,
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

type TextFieldProps = Omit<MUITextFieldProps, 'error' | 'onChange'> & {
  error?: FieldError
  onChange: (event: any) => void
  placeholder?: string
  value: string | undefined
}

export function TextField({
  error,
  label,
  onChange,
  placeholder,
  value,
  ...props
}: TextFieldProps) {
  return (
    <StyledTextField
      InputProps={{
        endAdornment: placeholder ? (
          <Tooltip arrow title={placeholder}>
            <InfoOutlinedIcon />
          </Tooltip>
        ) : null,
      }}
      color="secondary"
      error={!!error}
      fullWidth
      helperText={error?.message || ' '}
      label={label}
      onChange={onChange}
      value={value ? value : ''}
      variant={'standard'}
      {...props}
    />
  )
}
