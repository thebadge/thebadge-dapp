import React from 'react'

import { useDescription, useTsController } from '@ts-react/form'
import { ImageType } from 'react-images-uploading'
import { z } from 'zod'

import { ImageInput } from '@/src/components/form/formFields/ImageInput'
import { TSFormField } from '@/src/components/form/formFields/tsFormFields/addons/TSFormField'
import { TSFormFieldHint } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldHint'
import { TSFormFieldWrapper } from '@/src/components/form/formFields/tsFormFields/addons/TSFormFieldWrapper'
import { ImageSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function ImageInputWithTSForm() {
  const { error, field } = useTsController<z.infer<typeof ImageSchema>>()
  const { label, placeholder } = useDescription()

  return (
    <TSFormFieldWrapper>
      <TSFormFieldHint description={placeholder} label={label} />
      <TSFormField>
        <ImageInput
          error={error ? convertToFieldError(error) : undefined}
          label={label}
          onChange={(value: ImageType | null) => {
            if (value) {
              // We change the structure a little bit to have it ready to push to the backend
              field.onChange({
                mimeType: value.file?.type,
                base64File: value.base64File,
              })
            } else field.onChange(null)
          }}
          value={field.value}
        />
      </TSFormField>
    </TSFormFieldWrapper>
  )
}
