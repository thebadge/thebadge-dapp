import React from 'react'

import { Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import { KlerosDynamicFieldsCreator } from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/FormFieldCreator'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import RequirementInput from '@/src/pagePartials/badge/model/steps/community/strategy/RequirementInput'

export default function BadgeModelEvidenceFormCreation() {
  const { control } = useFormContext<CreateCommunityModelSchemaType>()
  return (
    <Stack gap={8}>
      <RequirementInput />

      <Typography variant="titleMedium">
        Fill in the details of the requested evidence here
      </Typography>
      <Controller
        control={control}
        name={'badgeMetadataColumns'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <KlerosDynamicFieldsCreator error={error} onChange={onChange} value={value} />
        )}
      />
    </Stack>
  )
}
