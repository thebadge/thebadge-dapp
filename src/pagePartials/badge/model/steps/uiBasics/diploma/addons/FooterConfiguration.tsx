import React, { useEffect } from 'react'

import { Stack } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { useCurrentUser } from '@/src/hooks/subgraph/useCurrentUser'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { FooterConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'
import { CreatorMetadata } from '@/types/badges/Creator'

export default function FooterConfiguration() {
  const { control, setValue, watch } = useFormContext<FooterConfigurationSchemaType>()

  const { data } = useCurrentUser()
  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(data?.metadataUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content

  const footerEnabled = watch('footerEnabled')

  useEffect(() => {
    // Automatically set the value when the footer is enabled, not editable right now
    if (footerEnabled && creatorMetadata?.name) {
      setValue('footerText', `${creatorMetadata?.name} hast confirmed the identity {{studentName}}`)
    }
  }, [creatorMetadata?.name, footerEnabled, setValue])

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
