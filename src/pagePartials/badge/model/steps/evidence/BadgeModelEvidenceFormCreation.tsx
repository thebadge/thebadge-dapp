import React from 'react'

import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { KlerosDynamicFieldsCreator } from '@/src/components/form/klerosDynamicFormField/FormFieldCreator'
import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'

export default function BadgeModelEvidenceFormCreation() {
  const { t } = useTranslation()
  const { control, watch } = useFormContext<CreateModelSchemaType>()
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
