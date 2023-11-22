import * as React from 'react'

import { TextArea } from '@/src/components/form/formFields/TextArea'
import { TSFormField } from '@/src/components/form/formFields/tsFormFields/addons/TSFormField'
import { TSFormFieldHint } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldHint'
import { TSFormFieldWrapper } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldWrapper'

export default function TextAreaPlaceholder({
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
        <TextArea disabled label={label} onChange={emptyOnChange} rows={3} value={undefined} />
      </TSFormField>
    </TSFormFieldWrapper>
  )
}
