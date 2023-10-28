import { useState } from 'react'
import * as React from 'react'

import { FormHelperText, Stack, styled } from '@mui/material'
import InputBase, { InputBaseProps } from '@mui/material/InputBase'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { FieldError } from 'react-hook-form'

const StyledInputBase = styled(InputBase)(({ error, theme }) => ({
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  ...(error && { borderBottom: '1px solid', borderColor: theme.palette.error.main }),
  '&:hover': {
    borderColor: theme.palette.text.secondary,
  },
  '&:focus-within': {
    '&::after': {
      width: '100%',
      height: 1,
      left: 0,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 1,
    background: theme.palette.secondary.light,
    transition: 'all 0.5s',
    bottom: -1,
    left: '50%',
  },
  input: {
    padding: 0,
    height: 'inherit',
  },
}))

export interface EditableTypographyProps {
  /**
   * Handler calling when the text changed
   */
  onChange?: (event: any) => void
  error?: FieldError
  multiline?: InputBaseProps['multiline']
  minRows?: InputBaseProps['minRows']
  maxRows?: InputBaseProps['maxRows']
  disabled?: InputBaseProps['disabled']
}

const InputBaseWithChildren = ({
  children,
  ...props
}: Omit<InputBaseProps, 'error'> & { children?: React.ReactNode; error?: FieldError }) => {
  let value = ''
  if (children) {
    if (typeof children == 'string' || typeof children == 'number') {
      value = children.toString()
    }
  }
  const hasError = !!props.error

  return (
    <Stack>
      <StyledInputBase
        {...props}
        className={''}
        error={hasError}
        inputProps={{ className: props.className }}
        value={value}
      />
      {hasError && <FormHelperText error={true}>{props.error?.message}</FormHelperText>}
    </Stack>
  )
}

/**
 * Displaying like a `Typography`. But acting as an `input`
 */
export default function TBEditableTypography({
  children,
  disabled,
  onChange: propsOnChange,
  ...props
}: EditableTypographyProps & Omit<TypographyProps, 'onChange'>) {
  const [internalValue, setInternalValue] = useState('')

  const onChange = (value: string) => {
    setInternalValue(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (propsOnChange) {
      propsOnChange(e)
    }
    onChange(e.target.value)
  }

  if (disabled) {
    return <Typography {...props}>{children || internalValue}</Typography>
  }
  return (
    <Typography {...props} component={InputBaseWithChildren} onChange={handleChange}>
      {children || internalValue}
    </Typography>
  )
}
