import * as React from 'react'

import { TextField as MUITextField } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

export default function TextField() {
  const { error, field } = useTsController<boolean>()
  const { label } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  console.log(label)
  return (
    <MUITextField
      color="secondary"
      error={!!error}
      helperText={error?.errorMessage}
      label={label}
      onChange={onChange}
      value={field.value ? field.value : ''}
      variant={'standard'}
    />
  )
}
