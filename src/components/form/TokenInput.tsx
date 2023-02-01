import { ChangeEvent, useEffect, useMemo } from 'react'

import { BigNumberish } from '@ethersproject/bignumber'
import { Box, Button, Stack, TextField, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { BigNumberInput } from 'big-number-input'
import { BigNumber } from 'ethers/lib/ethers'
import { formatUnits } from 'ethers/lib/utils'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { TokenInputSchema } from '@/src/components/form/helpers/customSchemas'
import { ErrorHelperProps } from '@/src/components/form/helpers/validators'

const Balance = styled(Box, { shouldForwardProp: (propName) => propName !== 'balancePosition' })<{
  balancePosition?: BalancePosition
}>(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1.2rem',
  fontWeight: '400',
  lineHeight: '1.2',
  whiteSpace: 'nowrap',
}))

type BalancePosition =
  | 'bottomCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'topCenter'
  | 'topLeft'
  | 'topRight'
  | undefined

interface Props extends ErrorHelperProps {
  balancePosition?: BalancePosition
  decimals: number
  maxDisabled?: boolean
  maxValue: BigNumberish
  symbol?: string
}

export default function TokenInput({
  balancePosition = 'topLeft',
  cleanError,
  decimals,
  maxDisabled,
  maxValue,
  setError,
  symbol,
}: Props) {
  const { error, field } = useTsController<z.infer<typeof TokenInputSchema>>()
  const { onChange, value } = field
  const { label, placeholder } = useDescription()

  const maxValueFormatted = formatUnits(maxValue, decimals)
  const valueGreaterThanMaxValue = useMemo(
    () => !!(value && BigNumber.from(value).gt(maxValue)),
    [maxValue, value],
  )

  useEffect(() => {
    if (valueGreaterThanMaxValue) {
      setError({ message: 'valueGreaterThanMaxValue', type: 'custom' })
    } else {
      cleanError()
    }
  }, [cleanError, setError, valueGreaterThanMaxValue])

  return (
    <FormField
      formControl={
        <Box display="flex" flexDirection="column">
          <BigNumberInput
            decimals={decimals}
            onChange={onChange}
            renderInput={(props) => (
              <Stack>
                <TextField
                  color="secondary"
                  inputProps={{
                    min: 0,
                  }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    props.onChange && props.onChange(e)
                  }
                  placeholder="0.00"
                  value={props.value}
                  variant="standard"
                />
              </Stack>
            )}
            value={value || ''}
          />
          <Box display="flex" flexDirection="row">
            <Balance balancePosition={balancePosition}>
              Balance: {maxValueFormatted} {symbol ? symbol : 'tokens'}
            </Balance>
            <Button
              color="error"
              disabled={maxDisabled}
              onClick={() => onChange(maxValueFormatted)}
            >
              Max
            </Button>
          </Box>
        </Box>
      }
      label={label}
      labelPosition={'top'}
      status={error || valueGreaterThanMaxValue ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error?.errorMessage}
    />
  )
}
