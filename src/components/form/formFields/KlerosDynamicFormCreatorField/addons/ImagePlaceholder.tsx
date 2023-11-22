import * as React from 'react'

import { ImageInput } from '@/src/components/form/formFields/ImageInput'
import { TSFormField } from '@/src/components/form/formFields/tsFormFields/addons/TSFormField'
import { TSFormFieldHint } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldHint'
import { TSFormFieldWrapper } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldWrapper'
import { Disable } from '@/src/components/helpers/DisableElements'

export default function ImagePlaceholder({
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
        <Disable disabled sx={{ width: '100%' }}>
          <ImageInput label={label} onChange={emptyOnChange} value={undefined} />
        </Disable>
      </TSFormField>
    </TSFormFieldWrapper>
  )
}
