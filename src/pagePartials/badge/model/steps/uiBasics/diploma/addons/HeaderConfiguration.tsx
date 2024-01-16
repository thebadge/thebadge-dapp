import React from 'react'

import { Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import { FileInput } from '@/src/components/form/formFields/FileInput'
import { HeaderConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'

export default function HeaderConfiguration() {
  const { control } = useFormContext<HeaderConfigurationSchemaType>()
  // TODO Check if user can change the header logo
  //  const { hasUserBalance } = useBadgesRequired()

  return (
    <>
      <SectionContainer>
        <Stack flex="1" gap={4} justifyContent="center">
          <Stack>
            <Typography variant="bodySmall">Header Image</Typography>
            <Controller
              control={control}
              name={'headerLogo'}
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
    </>
  )
}
