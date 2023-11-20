import React from 'react'

import { Stack } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { TextField } from '@/src/components/form/formFields/TextField'
import { FooterConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'

export default function FooterConfiguration() {
  const { control, watch } = useFormContext<FooterConfigurationSchemaType>()

  const footerEnabled = watch('footerEnabled')

  return (
    <>
      <SectionContainer>
        <Stack>
          <Controller
            control={control}
            name={'footerEnabled'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CheckBox
                error={error}
                label="Do you want to add identity verification?"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
      </SectionContainer>
      {footerEnabled && (
        <SectionContainer>
          <Stack flex="1" gap={4}>
            <Controller
              control={control}
              name={'footerText'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  ghostLabel={'account.eth hast confirmed the identity {{studentName}}'}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
        </SectionContainer>
      )}
    </>
  )
}
