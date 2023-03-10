import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Checkbox as MUICheckbox, Tooltip, Typography } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

type CheckBoxProps = {
  error?: FieldError
  label?: string
  onChange: (event: boolean) => void
  placeholder?: string
  value: boolean | undefined
}

export function CheckBox({ error, label, onChange, placeholder, value }: CheckBoxProps) {
  function handleChange() {
    onChange(!value)
  }

  return (
    <FormField
      formControl={
        <MUICheckbox checked={!!value} onChange={handleChange} sx={{ width: 'fit-content' }} />
      }
      label={
        <Typography>
          {label}
          {placeholder && (
            <Tooltip title={placeholder}>
              <InfoOutlinedIcon sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Typography>
      }
      labelPosition={'left'}
      status={error ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error?.message}
    />
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function CheckBoxWithTSForm() {
  const { error, field } = useTsController<boolean>()
  const { label, placeholder } = useDescription()

  function onChange(value: boolean) {
    field.onChange(value)
  }

  return (
    <CheckBox
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={field.value}
    />
  )
}
