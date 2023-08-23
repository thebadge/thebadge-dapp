import * as React from 'react'

import { useDescription, useTsController } from '@ts-react/form'
import { z } from 'zod'

import { TextArea } from '@/src/components/form/formFields/TextArea'
import { TSFormFieldHint } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldHint'
import { TSFormFieldWrapper } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldWrapper'
import { LongTextSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export function TextAreaWithTSForm({ rows = 3 }) {
  const { error, field } = useTsController<z.infer<typeof LongTextSchema>>()
  const { label, placeholder } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  return (
    <TSFormFieldWrapper>
      <TSFormFieldHint label={placeholder} />
      <TextArea
        error={error ? convertToFieldError(error) : undefined}
        label={label}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        value={field.value}
      />
    </TSFormFieldWrapper>
  )
}
