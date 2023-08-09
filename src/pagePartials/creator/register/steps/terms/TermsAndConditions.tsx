import React from 'react'

import { Box, Checkbox as MUICheckbox, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { CreatorRegisterSchemaType } from '../../schema/CreatorRegisterSchema'
import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'

export default function TermsAndConditions() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreatorRegisterSchemaType>()

  return (
    <Stack>
      <Controller
        control={control}
        name={'terms'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormField
            alignItems="center"
            formControl={
              <MUICheckbox
                checked={!!value}
                color="purple"
                onChange={onChange}
                sx={{ width: 'fit-content' }}
              />
            }
            label={'I have read and agree'}
            labelPosition={'left'}
            status={error ? TextFieldStatus.error : TextFieldStatus.success}
            statusText={error?.message}
          />
        )}
      />
      <Box display="flex" flex="1" justifyContent="center">
        <Typography
          fontSize={'14px !important'}
          sx={{ '& a': { textDecoration: 'underline !important' } }}
          textAlign="center"
          variant="body4"
        >
          {t('creator.register.form.termsConditions.youAgree')}
          <a href="/legal/terms" target="_blank">
            {t('creator.register.form.termsConditions.termsOfUse')}
          </a>
          {t('creator.register.form.termsConditions.and')}
          <a href="/legal/privacy-policy" target="_blank">
            {t('creator.register.form.termsConditions.privacy')}
          </a>
          .
        </Typography>
      </Box>
    </Stack>
  )
}
