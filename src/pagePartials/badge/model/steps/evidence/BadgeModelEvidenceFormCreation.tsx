import React from 'react'

import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { KlerosDynamicFieldsCreator } from '@/src/components/form/klerosDynamicFormField/FormFieldCreator'

export default function BadgeModelEvidenceFormCreation() {
  const { t } = useTranslation()
  const { control, watch } = useFormContext()
  return (
    <>
      <Controller
        control={control}
        name={'badgeMetadataColumns'}
        render={({ field: { name, onChange, value }, fieldState: { error } }) => (
          <KlerosDynamicFieldsCreator error={error} onChange={onChange} value={value} />
        )}
      />
    </>
  )
}
