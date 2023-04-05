import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, TextField as MUITextField, Tooltip, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'

import { convertToFieldError } from '@/src/components/form/helpers/validators'

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
    <Wrapper>
      <StyledTextField
        InputProps={{
          endAdornment: (
            <Tooltip arrow title={placeholder}>
              <InfoOutlinedIcon />
            </Tooltip>
          ),
        }}
        color="secondary"
        error={!!error}
        helperText={error?.message || ' '}
        label={label}
        onChange={onChange}
        sx={{ textTransform: 'capitalize' }}
        value={value ? value : ''}
        variant={'standard'}
      />
    </Wrapper>
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function TextFieldWithTSForm() {
  const { error, field } = useTsController<string>()
  const { label, placeholder } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  return (
    <TextField
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={field.value}
    />
  )
}
