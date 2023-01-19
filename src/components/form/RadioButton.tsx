import React from 'react'

import { Radio } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'

export function RadioButton() {
  const { error, field } = useTsController<boolean>()
  const { label } = useDescription()

  return (
    <FormField
      formControl={<Radio checked={!!field.value} />}
      label={label}
      status={error ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error?.errorMessage}
    />
  )
}
