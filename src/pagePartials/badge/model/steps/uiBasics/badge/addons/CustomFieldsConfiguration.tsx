import React, { useState } from 'react'

import { FormControl, FormControlLabel, RadioGroup, Stack, Typography } from '@mui/material'
import Radio from '@mui/material/Radio'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { ImageInput } from '@/src/components/form/formFields/ImageInput'
import { TextField } from '@/src/components/form/formFields/TextField'
import { CustomFieldsConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'

export default function CustomFieldsConfiguration() {
  const { t } = useTranslation()
  const { control, resetField, watch } = useFormContext<CustomFieldsConfigurationSchemaType>()
  const [customTextEnabled, setCustomTextEnabled] = useState<number>(0)
  const enabledFields = watch('customFieldsEnabled')

  const renderEnabledFields = () => (
    <SectionContainer>
      <Stack flex="1">
        <Stack flex="1">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                // If the custom text is enabled
                resetField('miniLogo.miniLogoUrl')
                resetField('miniLogo.miniLogoTitle')
                resetField('miniLogo.miniLogoSubTitle')
                setCustomTextEnabled(event.target.value as unknown as number)
              }}
              row
              sx={{ justifyContent: 'space-around' }}
              value={customTextEnabled}
            >
              <FormControlLabel
                control={<Radio />}
                label={t('badge.model.create.uiBasics.customFields.miniLogoConfigTextEnabled')}
                value={0}
              />
              <FormControlLabel
                control={<Radio />}
                label={t('badge.model.create.uiBasics.customFields.miniLogoConfigImageEnabled')}
                value={1}
              />
            </RadioGroup>
          </FormControl>
        </Stack>
        {customTextEnabled == 0 ? (
          <Stack flex="1">
            <Stack flex="1">
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
            <Stack flex="1">
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
          </Stack>
        ) : (
          <Stack flex="1" flexDirection="column">
            <Stack flex="1">
              <Typography variant="bodySmall">
                {t('badge.model.create.uiBasics.customFields.miniLogoUrl')}
              </Typography>
              <Controller
                control={control}
                name={'miniLogo.miniLogoUrl'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ImageInput
                    error={error}
                    onChange={(value: ImageType | null) => {
                      if (value) {
                        // We change the structure a little bit to have it ready to push to the backend
                        onChange({
                          mimeType: value.file?.type,
                          base64File: value.base64File,
                        })
                        return
                      }
                      onChange(null)
                    }}
                    value={value}
                  />
                )}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
    </SectionContainer>
  )

  return (
    <>
      <SectionContainer>
        <Stack flex="1">
          <Stack flex="1">
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
        </Stack>
      </SectionContainer>
      {enabledFields && renderEnabledFields()}
    </>
  )
}
