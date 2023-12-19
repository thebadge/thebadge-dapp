import { KeyboardEvent, useRef, useState } from 'react'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps,
  Tooltip,
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

type TextFieldProps = Omit<MUITextFieldProps, 'error' | 'onChange'> & {
  error?: FieldError
  onChange: (event: any) => void
  placeholder?: string
  // Temporal solution to show the real TextField placeholder as a level,
  // it's made on this way to prevent a huge rework around other usages
  ghostLabel?: string
  value: string | undefined
  allowVariables?: boolean
}

export function TextField({
  allowVariables,
  error,
  ghostLabel,
  label,
  onChange,
  placeholder,
  value,
  ...props
}: TextFieldProps) {
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
        InputProps={{
          endAdornment: placeholder ? (
            <Tooltip arrow title={placeholder}>
              <InfoOutlinedIcon />
            </Tooltip>
          ) : null,
        }}
        color="secondary"
        error={!!error}
        fullWidth
        helperText={error?.message || ' '}
        inputRef={inputRef}
        label={label}
        onChange={onChange}
        onKeyDown={handleVariablesPopover}
        placeholder={ghostLabel}
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
