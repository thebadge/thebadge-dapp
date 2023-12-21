import { KeyboardEvent, useRef, useState } from 'react'
import * as React from 'react'

import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps,
  styled,
} from '@mui/material'
import { FieldError } from 'react-hook-form'

import { VariablesDropdown } from '@/src/components/helpers/VariablesDropdown'
import { TemplateVariable } from '@/src/utils/enrichTextWithValues'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(0),
}))

type TextAreaProps = Omit<MUITextFieldProps, 'error' | 'onChange'> & {
  error?: FieldError
  label?: string
  onChange: (event: any) => void
  placeholder?: string
  rows?: number
  value: string | undefined
  allowVariables?: boolean
}
export function TextArea({
  allowVariables,
  error,
  label,
  onChange,
  placeholder,
  rows = 3,
  value,
  ...props
}: TextAreaProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleUseVariable = (variable: TemplateVariable) => {
    if (inputRef.current) {
      const { selectionEnd, selectionStart } = inputRef.current
      let text = ''
      if (value) {
        text = value.substring(0, selectionStart) + variable + value.substring(selectionEnd)
      } else {
        text = variable
      }
      onChange(text)
      inputRef.current.focus()
    }
  }

  const onPopoverVariableSelect = (value: TemplateVariable) => {
    handleUseVariable(value)
    setDropdownOpen(false)
  }

  const handleVariablesPopover = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '{' && allowVariables) {
      setDropdownOpen(true)
    }
  }

  return (
    <>
      <StyledTextField
        color="secondary"
        error={!!error}
        helperText={error?.message || ' '}
        inputRef={inputRef}
        label={label}
        multiline
        onChange={onChange}
        onKeyDown={handleVariablesPopover}
        placeholder={placeholder}
        rows={rows}
        sx={{ flex: 1 }}
        value={value ? value : ''}
        variant={'standard'}
        {...props}
      />
      {allowVariables && (
        <VariablesDropdown
          dropdownOpen={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          onSelect={onPopoverVariableSelect}
        />
      )}
    </>
  )
}
