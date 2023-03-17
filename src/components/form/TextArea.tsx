import * as React from 'react'

import { Box, TextField as MUITextField, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import { z } from 'zod'

import { LongTextSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

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

type TextAreaProps = {
  error?: FieldError
  label?: string
  onChange: (event: any) => void
  placeholder?: string
  rows?: number
  value: string | undefined
}
export function TextArea({ error, label, onChange, placeholder, rows = 3, value }: TextAreaProps) {
  return (
    <Wrapper>
      <StyledTextField
        color="secondary"
        error={!!error}
        helperText={error?.message || ' '}
        label={label}
        multiline
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        sx={{ textTransform: 'capitalize', flex: 1 }}
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
export default function TextAreaWithTSForm({ rows = 3 }) {
  const { error, field } = useTsController<z.infer<typeof LongTextSchema>>()
  const { label, placeholder } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  return (
    <TextArea
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      value={field.value}
    />
  )
}
