import { ChangeEvent, useState } from 'react'
import * as React from 'react'

import { TextField as MUITextField, Stack } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { BigNumberInput } from 'big-number-input'
import { formatUnits } from 'ethers/lib/utils'

type NumberFieldProps = {
  decimals?: number
}

export default function NumberField({ decimals = 0 }: NumberFieldProps) {
  const { error, field } = useTsController<number>()
  const [stringValue, setStringValue] = useState<string>('')
  const { label } = useDescription()

  function onChange(e: string) {
    const value = e
    setStringValue(value)
    if (e === '') {
      // We need to send a bad type to trigger the error in an easy way
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      field.onChange(e)
    } else {
      const formattedValue = formatUnits(value, decimals)
      field.onChange(Number(formattedValue))
    }
  }

  return (
    <BigNumberInput
      decimals={decimals}
      onChange={onChange}
      renderInput={(props) => (
        <Stack>
          <MUITextField
            color="secondary"
            error={!!error}
            helperText={error?.errorMessage}
            label={label}
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.onChange && props.onChange(e)}
            value={props.value}
            variant={'standard'}
          />
        </Stack>
      )}
      value={stringValue}
    />
  )
}
