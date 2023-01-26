import { DOMAttributes, HTMLAttributes, useEffect, useMemo } from 'react'

import { Box, Button, TextField, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { BigNumberInput } from 'big-number-input'
import { BigNumber } from 'ethers/lib/ethers'
import { formatUnits } from 'ethers/lib/utils'
import { z } from 'zod'

import { TokenInputSchema } from '@/src/components/form/helpers/customSchemas'

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
  position: 'absolute',
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

interface Props extends DOMAttributes<HTMLDivElement>, HTMLAttributes<HTMLDivElement> {
  balancePosition?: BalancePosition
  decimals: number
  setValue: (value: string) => void
  maxDisabled?: boolean
  maxValue: string
  symbol?: string
}

export default function TokenInput({
  balancePosition = 'topLeft',
  decimals,
  maxDisabled,
  maxValue,
  symbol,
}: Props) {
  const { error, field } = useTsController<z.infer<typeof TokenInputSchema>>()
  const { label, placeholder } = useDescription()

  const { onChange, value } = field
  const maxValueFormatted = formatUnits(maxValue, decimals)
  const valueGreaterThanMaxValue = useMemo(
    () => !!(value && BigNumber.from(value).gt(maxValue)),
    [maxValue, value],
  )

  useEffect(() => {
    if (valueGreaterThanMaxValue) {
      // TODO Find a way to support max values
    }
  }, [valueGreaterThanMaxValue])

  return (
    <Wrapper>
      <Balance balancePosition={balancePosition}>
        Balance: {maxValueFormatted} {symbol ? symbol : 'tokens'}
      </Balance>
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
            placeholder="0.00"
            type="number"
          />
        )}
        value={value || ''}
      />
      <Button color="error" disabled={maxDisabled} onClick={() => onChange(maxValue)}>
        Max
      </Button>
    </Wrapper>
  )
}
