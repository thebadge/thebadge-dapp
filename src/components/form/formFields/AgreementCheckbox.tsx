import * as React from 'react'

import { Divider, Checkbox as MUICheckbox, Stack, Typography } from '@mui/material'
import { CheckboxPropsColorOverrides } from '@mui/material/Checkbox/Checkbox'
import { OverridableStringUnion } from '@mui/types'
import { FieldError } from 'react-hook-form'

import { TextFieldStatus } from '@/src/components/form/formFields/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'

type AgreementFieldProps = {
  error?: FieldError
  onChange: (event: boolean) => void
  value: boolean | undefined
  color?: OverridableStringUnion<
    'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default',
    CheckboxPropsColorOverrides
  >
}

export function AgreementCheckbox({ color, error, onChange, value }: AgreementFieldProps) {
  function handleChange() {
    onChange(!value)
  }

  return (
    <Stack sx={{ mb: 2, gap: 2 }}>
      <Stack flexDirection="row" flexWrap="wrap" justifyContent="center">
        <FormField
          alignItems="center"
          formControl={
            <MUICheckbox
              checked={!!value}
              color={color || 'primary'}
              onChange={handleChange}
              sx={{ width: 'fit-content' }}
            />
          }
          label={'I have read and agree'}
          labelPosition={'left'}
          status={error ? TextFieldStatus.error : TextFieldStatus.success}
          statusText={error?.message}
        />
      </Stack>
      <Typography
        fontSize={'14px !important'}
        sx={{ '& a': { textDecoration: 'underline !important' } }}
        textAlign="center"
        variant="body4"
      >
        By continuing, you agree to our{' '}
        <a href="/legal/terms" target="_blank">
          terms of use
        </a>{' '}
        and{' '}
        <a href="/legal/privacy-policy" target="_blank">
          privacy policy
        </a>
        .
      </Typography>
      <Divider sx={{ borderWidth: '1px' }} />
    </Stack>
  )
}
