import React from 'react'

import { Alert, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { TextArea } from '@/src/components/form/formFields/TextArea'
import { TextField } from '@/src/components/form/formFields/TextField'
import { CustomFieldsConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'

export default function CustomFieldsConfiguration() {
  const { t } = useTranslation()
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
                label={t('badge.model.create.uiBasics.customFields.customFieldsEnabled')}
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
              <Typography variant="labelMedium">
                {t('badge.model.create.uiBasics.customFields.hint')}
              </Typography>
            </Alert>

            <Stack>
              <Typography variant="bodySmall">
                {t('badge.model.create.uiBasics.customFields.badgeTitle')}
              </Typography>
              <Controller
                control={control}
                name={'badgeTitle'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    allowVariables
                    error={error}
                    ghostLabel={t('badge.model.create.uiBasics.customFields.badgeTitle')}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Stack>

            <Stack>
              <Typography variant="bodySmall">
                {t('badge.model.create.uiBasics.customFields.badgeDescription')}
              </Typography>
              <Controller
                control={control}
                name={'badgeDescription'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextArea allowVariables error={error} onChange={onChange} value={value} />
                )}
              />
            </Stack>
          </Stack>
          <Stack flex="1" gap={4}>
            <Stack>
              <Typography variant="bodySmall">
                {t('badge.model.create.uiBasics.customFields.miniLogoTitle')}
              </Typography>
              <Controller
                control={control}
                name={'miniLogo.miniLogoTitle'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField allowVariables error={error} onChange={onChange} value={value} />
                )}
              />
            </Stack>
            <Stack>
              <Typography variant="bodySmall">
                {t('badge.model.create.uiBasics.customFields.miniLogoSubTitle')}
              </Typography>
              <Controller
                control={control}
                name={'miniLogo.miniLogoSubTitle'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField allowVariables error={error} onChange={onChange} value={value} />
                )}
              />
            </Stack>
            <Stack>
              <Typography variant="bodySmall">
                {t('badge.model.create.uiBasics.customFields.miniLogoUrl')}
              </Typography>
              <Controller
                control={control}
                name={'miniLogo.miniLogoUrl'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField allowVariables error={error} onChange={onChange} value={value} />
                )}
              />
            </Stack>
          </Stack>
        </SectionContainer>
      )}
    </>
  )
}
