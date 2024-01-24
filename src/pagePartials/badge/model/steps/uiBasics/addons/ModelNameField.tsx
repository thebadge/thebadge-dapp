import React from 'react'

import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { TextField } from '@/src/components/form/formFields/TextField'
import { ThirdPartyDefaultModelConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'

export default function ModelNameField({ allowVariables }: { allowVariables?: boolean }) {
  const { t } = useTranslation()

  const { control } = useFormContext<ThirdPartyDefaultModelConfigurationSchemaType>()

  return (
    <Stack>
      <Typography variant="bodySmall">
        {t('badge.model.create.uiBasics.templateConfig.title') + ' *'}
      </Typography>
      <Controller
        control={control}
        name={'name'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            allowVariables={allowVariables}
            error={error}
            ghostLabel={t('badge.model.create.uiBasics.name')}
            onChange={onChange}
            value={value}
          />
        )}
      />
    </Stack>
  )
}
