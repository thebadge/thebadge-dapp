import React from 'react'

import { Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { FileInput } from '@/src/components/form/formFields/FileInput'
import { TextField } from '@/src/components/form/formFields/TextField'
import { SignatureConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'

export default function SignatureConfiguration() {
  const { control, watch } = useFormContext<SignatureConfigurationSchemaType>()

  const enabledSignature = watch('signatureEnabled')

  return (
    <>
      <SectionContainer>
        <Stack>
          <Controller
            control={control}
            name={'signatureEnabled'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CheckBox
                error={error}
                label="Do you want to add a signature?"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
      </SectionContainer>
      {enabledSignature && (
        <SectionContainer>
          <Stack flex="1" gap={4}>
            <Stack>
              <Typography variant="bodySmall">Signer</Typography>
              <Controller
                control={control}
                name={'signerTitle'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    error={error}
                    ghostLabel={'Max Mustermann'}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Stack>

            <Stack>
              <Typography variant="bodySmall">Signer Title</Typography>
              <Controller
                control={control}
                name={'signerSubline'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    error={error}
                    ghostLabel={'CEO of TheGreatestCompany'}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Stack>
          </Stack>
          <Stack flex="1" gap={4} justifyContent="center">
            <Stack>
              <Typography variant="bodySmall">Signature Image</Typography>
              <Controller
                control={control}
                name={'signatureImage'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <FileInput
                    error={error}
                    onChange={(value: ImageType | null) => {
                      if (value) {
                        // We change the structure a little bit to have it ready to push to the backend
                        onChange({
                          mimeType: value.file?.type,
                          base64File: value.base64File,
                        })
                      } else onChange(null)
                    }}
                    value={value}
                  />
                )}
              />
            </Stack>
          </Stack>
        </SectionContainer>
      )}
    </>
  )
}
