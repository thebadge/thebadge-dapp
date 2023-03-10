import { ChangeEvent, useState } from 'react'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { TextField as MUITextField, Stack, Tooltip } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { BigNumberInput } from 'big-number-input'
import { formatUnits } from 'ethers/lib/utils'
import { FieldError } from 'react-hook-form'

import { convertToFieldError } from '@/src/components/form/helpers/validators'

type NumberFieldProps = {
  decimals?: number
  error?: FieldError
  label?: string
  onChange: (value: number) => void
  placeholder?: string
  value: number | undefined
}

export function NumberField({
  decimals = 0,
  error,
  label,
  onChange,
  placeholder,
}: NumberFieldProps) {
  const [stringValue, setStringValue] = useState<string>('')

  function handleOnChange(e: string) {
    const value = e
    setStringValue(value)
    if (e === '') {
      // We need to send a bad type to trigger the error in an easy way
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onChange(e)
    } else {
      const formattedValue = formatUnits(value, decimals)
      onChange(Number(formattedValue))
    }
  }

  return (
    <BigNumberInput
      decimals={decimals}
      onChange={handleOnChange}
      renderInput={(props) => (
        <Stack>
          <MUITextField
            InputProps={{
              endAdornment: placeholder ? (
                <Tooltip title={placeholder}>
                  <InfoOutlinedIcon sx={{ ml: 1 }} />
                </Tooltip>
              ) : null,
            }}
            color="secondary"
            error={!!error}
            helperText={error?.message || ' '}
            label={label}
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.onChange && props.onChange(e)}
            sx={{ textTransform: 'capitalize' }}
            value={props.value}
            variant={'standard'}
          />
        </Stack>
      )}
      value={stringValue}
    />
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function NumberFieldWithTSForm({ decimals = 0 }: { decimals?: number }) {
  const { error, field } = useTsController<number>()
  const { label, placeholder } = useDescription()

  function onChange(value: any) {
    field.onChange(value)
  }

  return (
    <NumberField
      decimals={decimals}
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={field.value}
    />
  )
}
