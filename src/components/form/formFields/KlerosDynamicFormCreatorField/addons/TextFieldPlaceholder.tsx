import * as React from 'react'

import { TextField } from '@/src/components/form/formFields/TextField'
import { TSFormField } from '@/src/components/form/formFields/tsFormFields/addons/TSFormField'
import { TSFormFieldHint } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldHint'
import { TSFormFieldWrapper } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldWrapper'

export default function TextFieldPlaceholder({
  description,
  label,
}: {
  label: string
  description: string
}) {
  function emptyOnChange() {
    // Empty function
  }
  return (
    <TSFormFieldWrapper>
      <TSFormFieldHint description={description} label={label} />
      <TSFormField>
        <TextField disabled label={label} onChange={emptyOnChange} value={undefined} />
      </TSFormField>
    </TSFormFieldWrapper>
  )
}
