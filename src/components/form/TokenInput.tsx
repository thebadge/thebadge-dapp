import { ChangeEvent, DOMAttributes, HTMLAttributes, useEffect, useMemo } from 'react'

import { Box, Button, TextField, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { BigNumberInput } from 'big-number-input'
import { BigNumber } from 'ethers/lib/ethers'
import { formatUnits } from 'ethers/lib/utils'
import { ErrorOption } from 'react-hook-form/dist/types/errors'
import { z } from 'zod'

import { TokenInputSchema } from '@/src/components/form/helpers/customSchemas'
import { ErrorHelperProps } from '@/src/components/form/helpers/validators'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  width: '100%',
}))

const Balance = styled(Box)<{ balancePosition?: BalancePosition }>(({ theme }) => ({
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
  maxValue: string
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
    <Wrapper>
      <Balance balancePosition={balancePosition}>
        Balance: {maxValueFormatted} {symbol ? symbol : 'tokens'}
      </Balance>
      <Box display="flex" flexDirection="row">
        <BigNumberInput
          decimals={decimals}
          onChange={onChange}
          renderInput={(props) => (
            <TextField
              error={valueGreaterThanMaxValue}
              helperText={error?.errorMessage}
              inputProps={{
                min: 0,
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => props.onChange && props.onChange(e)}
              placeholder="0.00"
              type="number"
              value={props.value}
              variant="standard"
            />
          )}
          value={value || ''}
        />
        <Button color="error" disabled={maxDisabled} onClick={() => onChange(maxValue)}>
          Max
        </Button>
      </Box>
    </Wrapper>
  )
}
