import React, { ChangeEvent } from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { TextField, Tooltip, Typography } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import { ZodSchema, z } from 'zod'

import { convertToFieldError } from '@/src/components/form/helpers/validators'
import { capitalizeFirstLetter } from '@/src/utils/strings'

type DropdownSelectProps = {
  error?: FieldError
  label?: string
  onChange: (value: string) => void
  placeholder?: string
  value: string | undefined
  options: string[]
  native?: boolean
}
export function DropdownSelect({
  error,
  label,
  native = true,
  onChange,
  options,
  placeholder,
  value,
}: DropdownSelectProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange(event.target.value as string)
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
      error={!!error}
      fullWidth
      helperText={error ? error.message : ' '}
      label={
        <Typography id="select-helper-label">
          {label}
          {placeholder && (
            <Tooltip arrow title={placeholder}>
              <InfoOutlinedIcon />
            </Tooltip>
          )}
        </Typography>
      }
      onChange={handleChange}
      select
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

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function DropdownSelectWithTSForm({
  options,
  schema, // Receives schema as prop, to be able to use the same dropdown with different schemas
}: {
  options: string[]
  schema: ZodSchema
}) {
  const { error, field } = useTsController<z.infer<typeof schema>>()
  const { label, placeholder } = useDescription()

  function onChange(value: z.infer<typeof schema>) {
    field.onChange(value)
  }

  return (
    <DropdownSelect
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      value={field.value}
    />
  )
}
