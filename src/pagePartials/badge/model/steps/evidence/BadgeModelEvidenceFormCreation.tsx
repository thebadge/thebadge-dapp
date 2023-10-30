import React from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import { KlerosDynamicFieldsCreator } from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/FormFieldCreator'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'

export default function BadgeModelEvidenceFormCreation() {
  const { control } = useFormContext<CreateCommunityModelSchemaType>()
  return (
    <>
      <Controller
        control={control}
        name={'badgeMetadataColumns'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <KlerosDynamicFieldsCreator error={error} onChange={onChange} value={value} />
        )}
      />
    </>
  )
}
