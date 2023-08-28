import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Checkbox as MUICheckbox, Tooltip, Typography } from '@mui/material'
import { FieldError } from 'react-hook-form'

import { TextFieldStatus } from '@/src/components/form/formFields/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'

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
      alignItems="center"
      formControl={
        <MUICheckbox checked={!!value} onChange={handleChange} sx={{ width: 'fit-content' }} />
      }
      label={
        <Typography color="text.disabled">
          {label}
          {placeholder && (
            <Tooltip arrow title={placeholder}>
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
