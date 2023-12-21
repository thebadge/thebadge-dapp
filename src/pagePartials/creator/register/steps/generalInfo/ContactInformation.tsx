import React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { CONTACT_METHODS, CreatorRegisterSchemaType } from '../../schema/CreatorRegisterSchema'
import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import { TextField } from '@/src/components/form/formFields/TextField'

export default function ContactInformation() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreatorRegisterSchemaType>()

  return (
    <Stack gap={2}>
      <Typography variant="dAppTitle1">{t('creator.register.form.contactData.title')}</Typography>
      <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
        <Stack flex="1" gap={2}>
          <Controller
            control={control}
            name={'email'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                label={t('creator.register.form.contactData.email')}
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name={'twitter'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                label={t('creator.register.form.contactData.twitter')}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
        <Stack flex="1" gap={2}>
          <Controller
            control={control}
            name={'discord'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                label={t('creator.register.form.contactData.discord')}
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name={'website'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                label={t('creator.register.form.contactData.website')}
                onChange={onChange}
                placeholder={t('creator.register.form.contactData.website')}
                value={value}
              />
            )}
          />
        </Stack>
      </Box>
      <Controller
        control={control}
        name={'preferContactMethod'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Box alignItems="center" display="flex" gap={1} justifyContent="center">
            <Typography>{t('creator.register.form.contactData.preferContactMethod')}</Typography>

            <DropdownSelect
              error={error}
              label={''}
              onChange={onChange}
              options={[...CONTACT_METHODS]}
              sx={{ width: 'fit-content' }}
              value={value || 'email'}
            />
          </Box>
        )}
      />
    </Stack>
  )
}
