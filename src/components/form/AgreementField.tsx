import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Divider, Checkbox as MUICheckbox, Stack, Tooltip, Typography } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

type AgreementFieldProps = {
  error?: FieldError
  label?: string
  onChange: (event: boolean) => void
  placeholder?: string
  value: boolean | undefined
  agreementText: string
}

export function AgreementField({
  agreementText,
  error,
  label,
  onChange,
  placeholder,
  value,
}: AgreementFieldProps) {
  function handleChange() {
    onChange(!value)
  }

  // 👇	ReactMarkdown needs to have the children as a prop
  /* eslint-disable react/no-children-prop */
  return (
    <Stack sx={{ mb: 2, gap: 2 }}>
      <Typography fontWeight="bold" variant={'h5'}>
        {label}
        {placeholder && (
          <Tooltip title={placeholder}>
            <InfoOutlinedIcon sx={{ ml: 1 }} />
          </Tooltip>
        )}
      </Typography>
      <Box maxHeight={'350px'} overflow="auto">
        <Typography component={'div'}>
          {/* ReactMarkdown want it in this way  */}
          <ReactMarkdown
            children={agreementText}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank">
                  {props.href?.replace(/^.*:\/\//i, '')}
                </a>
              ),
            }}
            remarkPlugins={[remarkGfm]}
          />
        </Typography>
      </Box>
      <Stack>
        <FormField
          formControl={
            <MUICheckbox checked={!!value} onChange={handleChange} sx={{ width: 'fit-content' }} />
          }
          label={'I have read and agree'}
          labelPosition={'left'}
          status={error ? TextFieldStatus.error : TextFieldStatus.success}
          statusText={error?.message}
        />
        <Divider sx={{ borderWidth: '1px' }} />
      </Stack>
    </Stack>
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function AgreementFieldWithTSForm({ agreementText }: { agreementText: string }) {
  const { error, field } = useTsController<boolean>()
  const { label, placeholder } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  return (
    <AgreementField
      agreementText={agreementText}
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={field.value}
    />
  )
}
