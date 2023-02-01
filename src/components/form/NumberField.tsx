import * as React from 'react'

import { TextField as MUITextField, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(1),
}))

export default function NumberField() {
  const { error, field } = useTsController<number>()
  const { label } = useDescription()

  function onChange(e: any) {
    field.onChange(Number(e.target.value.replace(/[^0-9.]/g, '')))
  }

  return (
    <StyledTextField
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
