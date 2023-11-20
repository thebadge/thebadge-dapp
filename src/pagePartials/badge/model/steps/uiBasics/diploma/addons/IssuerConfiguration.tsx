import React from 'react'

import { Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { TextField } from '@/src/components/form/formFields/TextField'
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
          <Stack flex="1" gap={2}>
            <Typography variant="bodySmall">Issuer Avatar</Typography>
            <Controller
              control={control}
              name={'issuerAvatarUrl'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField error={error} onChange={onChange} value={value} />
              )}
            />
          </Stack>
        </SectionContainer>
      )}
    </>
  )
}
