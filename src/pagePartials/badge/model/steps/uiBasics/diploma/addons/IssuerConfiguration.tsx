import React from 'react'

import { Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { FileInput } from '@/src/components/form/formFields/FileInput'
import { IssuerConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'

export default function IssuerConfiguration() {
  const { control, watch } = useFormContext<IssuerConfigurationSchemaType>()

  const customIssuerEnabled = watch('customIssuerEnabled')

  return (
    <>
      <SectionContainer>
        <Stack>
          <Controller
            control={control}
            name={'customIssuerEnabled'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CheckBox
                error={error}
                label="Do you want to customize the issuer data?"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
      </SectionContainer>
      {customIssuerEnabled && (
        <SectionContainer>
          <Stack flex="1" gap={4} justifyContent="center">
            <Stack>
              <Typography variant="bodySmall">Issuer Avatar</Typography>
              <Controller
                control={control}
                name={'issuerAvatar'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <FileInput
                    acceptType={['jpg', 'gif', 'png']}
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
