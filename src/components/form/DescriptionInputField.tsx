import * as React from 'react'

import { Box, TextField as MUITextField, Typography, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import { z } from 'zod'

import { DescriptionTextSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'
import { ENRICH_TEXT_VARIABLES } from '@/src/utils/enrichTextWithValues'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  gridColumn: 'auto',
}))

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(0),
}))

const VariableContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 0.75),
  marginRight: theme.spacing(0.5),
  borderRadius: theme.spacing(0.5),
  cursor: 'pointer',
}))

type DescriptionInputFieldProps = {
  error?: FieldError
  label?: string
  onChange: (event: string) => void
  placeholder?: string
  value: z.infer<typeof DescriptionTextSchema> | undefined
}

export function DescriptionInputField({
  error,
  label,
  onChange,
  placeholder,
  value,
}: DescriptionInputFieldProps) {
  function handleOnChange(e: any) {
    onChange(e.target.value)
  }

  function appendVariable(variable: string) {
    if (value) {
      onChange(value + ` ${variable} `)
    } else {
      onChange(`${variable} `)
    }
  }

  return (
    <Wrapper>
      <Typography>{label}</Typography>
      <Typography fontWeight={300} sx={{ fontSize: '12px !important' }}>
        Personalize the description with any of this variables:
      </Typography>
      <Box display="flex">
        {ENRICH_TEXT_VARIABLES.map((it) => (
          <VariableContainer key={it}>
            <Typography
              color="blue"
              fontWeight="bold"
              onClick={() => appendVariable(it)}
              sx={{ fontSize: '12px !important' }}
              variant="body2"
            >
              {it}
            </Typography>
          </VariableContainer>
        ))}
      </Box>
      <StyledTextField
        color="secondary"
        error={!!error}
        helperText={error?.message || ' '}
        multiline
        onChange={handleOnChange}
        placeholder={placeholder}
        rows={3}
        sx={{ textTransform: 'capitalize' }}
        value={value ? value : ''}
        variant={'standard'}
      />
    </Wrapper>
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function DescriptionInputFieldWithTSForm() {
  const { error, field } = useTsController<z.infer<typeof DescriptionTextSchema>>()
  const { label, placeholder } = useDescription()

  function onChange(value: string) {
    field.onChange(value)
  }

  return (
    <DescriptionInputField
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={field.value}
    />
  )
}
