import { ChangeEvent, useState } from 'react'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { TextField as MUITextField, Stack, Tooltip } from '@mui/material'
import { BigNumberInput } from 'big-number-input'
import { formatUnits } from 'ethers/lib/utils'
import { FieldError } from 'react-hook-form'

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
                <Tooltip arrow title={placeholder}>
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
