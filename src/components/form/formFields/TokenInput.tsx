import { ChangeEvent, useCallback, useEffect, useMemo } from 'react'

import { BigNumberish } from '@ethersproject/bignumber'
import { Box, Button, InputAdornment, Stack, TextField, styled } from '@mui/material'
import { BigNumberInput } from 'big-number-input'
import { BigNumber } from 'ethers/lib/ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { FieldError } from 'react-hook-form'

const Balance = styled(Box, { shouldForwardProp: (propName) => propName !== 'balancePosition' })<{
  balancePosition?: BalancePosition
}>(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1.2rem',
  fontWeight: '400',
  lineHeight: '1.2',
  whiteSpace: 'nowrap',
  paddingTop: '3px',
}))

type BalancePosition =
  | 'bottomCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'topCenter'
  | 'topLeft'
  | 'topRight'
  | undefined

interface SharedProps {
  balancePosition?: BalancePosition
  decimals: number
  maxDisabled?: boolean
  symbol?: string
}

interface Props extends SharedProps {
  value: string
  setStatusText?: (statusText: string | undefined) => void
  onChange: (value: string) => void
  maxValue?: BigNumberish
  error?: FieldError
  label?: string
  disabled?: boolean
  hiddenBalance?: boolean
}

export function TokenInput({
  balancePosition = 'topLeft',
  decimals,
  error,
  hiddenBalance,
  label,
  maxDisabled,
  maxValue = '0',
  onChange,
  setStatusText,
  symbol,
  value,
}: Props) {
  if (!hiddenBalance && !setStatusText) {
    throw `[TokenInput]: You must provide a setStatusText function if you want to show the balance`
  }
  const maxValueFormatted = formatUnits(maxValue, decimals)
  const valueGreaterThanMaxValue = useMemo(
    () => !!(value && BigNumber.from(value).gt(maxValue)),
    [maxValue, value],
  )

  const setMaxValue = useCallback(() => {
    onChange(parseUnits(maxValueFormatted).toString())
  }, [maxValueFormatted, onChange])

  useEffect(() => {
    if (!setStatusText) return
    if (valueGreaterThanMaxValue) {
      setStatusText('Insufficient balance')
    } else {
      setStatusText(undefined)
    }
  }, [setStatusText, valueGreaterThanMaxValue])

  return (
    <Stack justifyContent="space-between">
      {!hiddenBalance && (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Balance balancePosition={balancePosition}>
            Balance: {(+maxValueFormatted).toFixed(4)} {symbol ? symbol : 'tokens'}
          </Balance>
          <Button color="error" disabled={maxDisabled} onClick={setMaxValue}>
            Max
          </Button>
        </Box>
      )}
      <BigNumberInput
        decimals={decimals}
        onChange={onChange}
        renderInput={(props) => (
          <Stack>
            <TextField
              InputProps={{
                endAdornment: symbol && <InputAdornment position="end">{symbol}</InputAdornment>,
              }}
              color="secondary"
              error={!!error}
              helperText={error?.message}
              inputProps={{
                min: 0,
              }}
              label={label}
              onChange={(e: ChangeEvent<HTMLInputElement>) => props.onChange && props.onChange(e)}
              placeholder="0.00"
              value={props.value}
              variant="standard"
            />
          </Stack>
        )}
        value={value || ''}
      />
    </Stack>
  )
}
