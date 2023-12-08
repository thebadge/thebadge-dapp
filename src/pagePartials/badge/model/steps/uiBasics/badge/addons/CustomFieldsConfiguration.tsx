import React from 'react'

import { Alert, Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { TextArea } from '@/src/components/form/formFields/TextArea'
import { TextField } from '@/src/components/form/formFields/TextField'
import { CustomFieldsConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'

export default function CustomFieldsConfiguration() {
  const { control, watch } = useFormContext<CustomFieldsConfigurationSchemaType>()

  const enabledFields = watch('customFieldsEnabled')

  return (
    <>
      <SectionContainer>
        <Stack>
          <Controller
            control={control}
            name={'customFieldsEnabled'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CheckBox
                error={error}
                label="Do you want to customiza the texts?"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
      </SectionContainer>
      {enabledFields && (
        <SectionContainer>
          <Stack flex="1" gap={4}>
            <Alert severity="info">
              <Typography variant="labelMedium">{`You can press '{' to use custom variables on your fields`}</Typography>
            </Alert>

            <Stack>
              <Typography variant="bodySmall">Badge Title</Typography>
              <Controller
                control={control}
                name={'badgeTitle'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    allowVariables
                    error={error}
                    ghostLabel={'Badge Title'}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Stack>

            <Stack>
              <Typography variant="bodySmall">Badge Description</Typography>
              <Controller
                control={control}
                name={'badgeDescription'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextArea allowVariables error={error} onChange={onChange} value={value} />
                )}
              />
            </Stack>
          </Stack>
        </SectionContainer>
      )}
    </>
  )
}
