import * as React from 'react'

import { TextField as MUITextField, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { z } from 'zod'

import { LongTextSchema } from '@/src/components/form/helpers/customSchemas'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(1),
}))

export default function TextArea() {
  const { error, field } = useTsController<z.infer<typeof LongTextSchema>>()
  const { label, placeholder } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  return (
    <StyledTextField
      color="secondary"
      error={!!error}
      helperText={error?.errorMessage}
      label={label}
      multiline
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      value={field.value ? field.value : ''}
      variant={'standard'}
    />
  )
}
