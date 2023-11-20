import React from 'react'

import { Stack } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { FooterConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'

export default function FooterConfiguration() {
  const { control } = useFormContext<FooterConfigurationSchemaType>()

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
    </>
  )
}
