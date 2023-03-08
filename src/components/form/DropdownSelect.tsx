import React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select as MUISelect,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import { ZodSchema, z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormStatus } from '@/src/components/form/helpers/FormStatus'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

type DropdownSelectProps = {
  error?: FieldError
  label?: string
  onChange: (value: string) => void
  placeholder?: string
  value: string | undefined
  options: string[]
}
export function DropdownSelect({
  error,
  label,
  onChange,
  options,
  placeholder,
  value,
}: DropdownSelectProps) {
  function handleChange(event: SelectChangeEvent) {
    onChange(event.target.value as string)
  }

  return (
    <FormControl sx={{ mx: 1, minWidth: 200 }} variant="standard">
      <InputLabel id="select-helper-label">
        {label}
        {placeholder && (
          <Tooltip title={placeholder}>
            <InfoOutlinedIcon />
          </Tooltip>
        )}
      </InputLabel>
      <MUISelect
        error={!!error}
        id="simple-select"
        label={label}
        labelId="select-helper-label"
        onChange={handleChange}
        sx={{ textTransform: 'capitalize' }}
        value={value || ''}
      >
        {options.map((op) => {
          return (
            <MenuItem key={op} sx={{ textTransform: 'capitalize' }} value={op}>
              {op}
            </MenuItem>
          )
        })}
      </MUISelect>
      <FormHelperText>
        {error ? <FormStatus status={TextFieldStatus.error}>{error.message}</FormStatus> : ' '}
      </FormHelperText>
    </FormControl>
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
