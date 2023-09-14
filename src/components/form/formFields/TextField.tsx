import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, TextField as MUITextField, Tooltip, styled } from '@mui/material'
import { FieldError } from 'react-hook-form'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
}))

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(0),
}))

type TextFieldProps = {
  error?: FieldError
  label?: string
  onChange: (event: any) => void
  placeholder?: string
  value: string | undefined
}

export function TextField({ error, label, onChange, placeholder, value }: TextFieldProps) {
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
      helperText={error?.message || ' '}
      label={label}
      onChange={onChange}
      sx={{ textTransform: 'capitalize', width: '100%' }}
      value={value ? value : ''}
      variant={'standard'}
    />
  )
}
