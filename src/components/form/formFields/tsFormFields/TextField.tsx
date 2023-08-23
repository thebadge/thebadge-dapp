import * as React from 'react'

import { useDescription, useTsController } from '@ts-react/form'

import { TextField } from '@/src/components/form/formFields/TextField'
import { TSFormFieldHint } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldHint'
import { TSFormFieldWrapper } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldWrapper'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export function TextFieldWithTSForm() {
  const { error, field } = useTsController<string>()
  const { label, placeholder } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  return (
    <TSFormFieldWrapper>
      <TSFormFieldHint label={placeholder} />
      <TextField
        error={error ? convertToFieldError(error) : undefined}
        label={label}
        onChange={onChange}
        value={field.value}
      />
    </TSFormFieldWrapper>
  )
}
