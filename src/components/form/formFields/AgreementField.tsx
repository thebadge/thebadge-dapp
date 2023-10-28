import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Divider, Checkbox as MUICheckbox, Stack, Tooltip, Typography } from '@mui/material'
import { CheckboxPropsColorOverrides } from '@mui/material/Checkbox/Checkbox'
import { OverridableStringUnion } from '@mui/types'
import { FieldError } from 'react-hook-form'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { TextFieldStatus } from '@/src/components/form/formFields/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import {
  generateLegalPrivacyPolicyUrl,
  generateLegalTermsUrl,
} from '@/src/utils/navigation/generateUrl'

type AgreementFieldProps = {
  error?: FieldError
  label?: string
  onChange: (event: boolean) => void
  placeholder?: string
  value: boolean | undefined
  agreementText: string
  color?: OverridableStringUnion<
    'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default',
    CheckboxPropsColorOverrides
  >
}

export function AgreementField({
  agreementText,
  color,
  error,
  label,
  onChange,
  placeholder,
  value,
}: AgreementFieldProps) {
  function handleChange() {
    onChange(!value)
  }

  return (
    <Stack sx={{ mb: 2, gap: 2 }}>
      <Typography fontWeight="bold" textAlign="center" variant={'h5'}>
        {label}
        {placeholder && (
          <Tooltip arrow title={placeholder}>
            <InfoOutlinedIcon sx={{ ml: 1 }} />
          </Tooltip>
        )}
      </Typography>
      <Box maxHeight={'580px'} overflow="auto">
        <MarkdownTypography>{agreementText}</MarkdownTypography>
      </Box>
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
        <a href={generateLegalTermsUrl()} target="_blank">
          terms of use
        </a>{' '}
        and{' '}
        <a href={generateLegalPrivacyPolicyUrl()} target="_blank">
          privacy policy
        </a>
        .
      </Typography>
      <Divider sx={{ borderWidth: '1px' }} />
    </Stack>
  )
}
