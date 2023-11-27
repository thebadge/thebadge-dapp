import React from 'react'

import { Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import { TextField } from '@/src/components/form/formFields/TextField'
import { BodyDataConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'
import { useTranslation } from 'next-export-i18n'

export default function BodyDataConfiguration() {
  const { control } = useFormContext<BodyDataConfigurationSchemaType>()
  const { t } = useTranslation()

  return (
    <SectionContainer>
      <Stack flex="1" gap={4}>
        <Stack>
          <Typography variant="bodySmall">
            {t('badge.model.create.uiBasics.templateConfig.diplomaName')}
          </Typography>
          <Controller
            control={control}
            name={'courseName'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                ghostLabel={'Name of the course'}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>

        <Stack>
          <Typography variant="bodySmall">
            {t('badge.model.create.uiBasics.templateConfig.description')}
          </Typography>
          <Controller
            control={control}
            name={'achievementDescription'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                ghostLabel={'has successfully completed the course'}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
      </Stack>

      <Stack flex="1" gap={4}>
        <Stack>
          <Typography variant="bodySmall">
            {t('badge.model.create.uiBasics.templateConfig.diplomaDate')}
          </Typography>
          <Controller
            control={control}
            name={'achievementDate'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                ghostLabel={'November 9, 2023'}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
      </Stack>
    </SectionContainer>
  )
}
