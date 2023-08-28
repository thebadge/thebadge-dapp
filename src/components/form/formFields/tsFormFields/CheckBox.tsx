import * as React from 'react'

import { useDescription, useTsController } from '@ts-react/form'

import { CheckBox } from '../CheckBox'
import { TSFormField } from '@/src/components/form/formFields/tsFormFields/addons/TSFormField'
import { TSFormFieldHint } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldHint'
import { TSFormFieldWrapper } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldWrapper'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

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
    <TSFormFieldWrapper>
      <TSFormFieldHint description={placeholder} label={label} />
      <TSFormField>
        <CheckBox
          error={error ? convertToFieldError(error) : undefined}
          label={label}
          onChange={onChange}
          value={field.value}
        />
      </TSFormField>
    </TSFormFieldWrapper>
  )
}
