import * as React from 'react'

import { useDescription, useTsController } from '@ts-react/form'

import { NumberField } from '@/src/components/form/formFields/NumberField'
import { TSFormFieldHint } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldHint'
import { TSFormFieldWrapper } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldWrapper'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function NumberFieldWithTSForm({ decimals = 0 }: { decimals?: number }) {
  const { error, field } = useTsController<number>()
  const { label, placeholder } = useDescription()

  function onChange(value: any) {
    field.onChange(value)
  }

  return (
    <TSFormFieldWrapper>
      <TSFormFieldHint label={placeholder} />
      <NumberField
        decimals={decimals}
        error={error ? convertToFieldError(error) : undefined}
        label={label}
        onChange={onChange}
        value={field.value}
      />
    </TSFormFieldWrapper>
  )
}
