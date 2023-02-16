import React from 'react'

import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select as MUISelect,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { ZodSchema, z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormStatus } from '@/src/components/form/helpers/FormStatus'

export default function DropdownSelect({
  options,
  schema, // Receives schema as prop, to be able to use the same dropdown with different schemas
}: {
  options: string[]
  schema: ZodSchema
}) {
  const { error, field } = useTsController<z.infer<typeof schema>>()
  const { label } = useDescription()

  function handleChange(event: SelectChangeEvent) {
    field.onChange(event.target.value as string)
  }

  return (
    <FormControl sx={{ mx: 1, minWidth: 200 }} variant="standard">
      <InputLabel id="select-helper-label">{label}</InputLabel>
      <MUISelect
        error={!!error}
        id="simple-select"
        label={label}
        labelId="select-helper-label"
        onChange={handleChange}
        sx={{ textTransform: 'capitalize' }}
        value={field.value || ''}
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
        {error ? <FormStatus status={TextFieldStatus.error}>{error.errorMessage}</FormStatus> : ' '}
      </FormHelperText>
    </FormControl>
  )
}
