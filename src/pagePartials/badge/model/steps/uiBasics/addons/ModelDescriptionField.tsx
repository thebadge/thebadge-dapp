import React from 'react'

import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { TextArea } from '@/src/components/form/formFields/TextArea'
import { ThirdPartyDefaultModelConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'

export default function ModelDescriptionField({ allowVariables }: { allowVariables?: boolean }) {
  const { t } = useTranslation()

  const { control } = useFormContext<ThirdPartyDefaultModelConfigurationSchemaType>()

  return (
    <Stack>
      <Typography variant="bodySmall">
        {t('badge.model.create.uiBasics.templateConfig.description') + ' *'}
      </Typography>
      <Controller
        control={control}
        name={'description'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextArea
            allowVariables={allowVariables}
            error={error}
            onChange={onChange}
            placeholder={t('badge.model.create.uiBasics.description')}
            value={value}
          />
        )}
      />
    </Stack>
  )
}
