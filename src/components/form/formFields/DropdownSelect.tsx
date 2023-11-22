import React, { ChangeEvent } from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { TextField, Theme, Tooltip, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { FieldError } from 'react-hook-form'

import { capitalizeFirstLetter } from '@/src/utils/strings'

type DropdownSelectProps<T> = {
  error?: FieldError
  label?: string
  onChange: (value: T) => void
  placeholder?: string
  value: T | undefined
  options: string[]
  native?: boolean
  disabled?: boolean
  sx?: SxProps<Theme>
}
export function DropdownSelect<T>({
  disabled,
  error,
  label,
  native = true,
  onChange,
  options,
  placeholder,
  sx,
  value,
}: DropdownSelectProps<T>) {
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange(event.target.value as T)
  }

  return (
    <TextField
      SelectProps={{
        native,
        MenuProps: {
          PaperProps: {
            sx: {
              ...(!native && {
                px: 1,
                maxHeight: 'unset',
                '& .MuiMenuItem-root': {
                  px: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                },
              }),
            },
          },
        },
        sx: { textTransform: 'capitalize' },
      }}
      disabled={disabled}
      error={!!error}
      fullWidth
      helperText={error ? error.message : ' '}
      label={
        label && (
          <Typography id="select-helper-label">
            {label}
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon />
              </Tooltip>
            )}
          </Typography>
        )
      }
      onChange={handleChange}
      select
      sx={sx}
      value={value || ''}
      variant="standard"
    >
      {options.map((op) => {
        return (
          <option key={op} value={op}>
            {capitalizeFirstLetter(op)}
          </option>
        )
      })}
    </TextField>
  )
}
