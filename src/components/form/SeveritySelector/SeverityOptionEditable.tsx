import { ChangeEvent, MouseEvent, useCallback, useState } from 'react'
import * as React from 'react'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
  styled,
} from '@mui/material'
import { BigNumberInput } from 'big-number-input'
import { formatUnits } from 'ethers/lib/utils'
import { z } from 'zod'

import { SEVERITY_COLORS, SEVERITY_FEES } from './utilts'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useJurorFee } from '@/src/hooks/kleros/useJurorFee'
import { Severity } from '@/types/utils'
const CustomOptionPaper = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'color' && propName !== 'selected',
})<{
  color: string
  selected: boolean
}>(({ color, selected, theme }) => ({
  margin: theme.spacing(1),
  width: 160,
  height: 160,
  cursor: 'pointer',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  transition: 'all .3s cubic-bezier(0.65, 0, 0.35, 1)',
  borderWidth: selected ? '2px' : '1px',
  borderStyle: 'solid',
  borderRadius: theme.spacing(1),
  borderColor: selected ? color : alpha(color, 0.8),
  background: alpha(color, 0.2),
  '&:hover': {
    background: alpha(color, 0.4),
    borderWidth: '2px',
    borderColor: color,
  },
}))

const VerySmallTextField = styled(TextField)(() => ({
  width: '50%',
  margin: 'auto',
  '& .MuiInputBase-root': {
    fontSize: '12px !important',
  },
  '& .MuiInputBase-input': {
    textAlign: 'center',
  },
  '& .MuiFormLabel-root': {
    fontSize: '12px !important',
  },
}))

export default function SeverityOptionEditable({
  onChange,
  onSelect,
  selected,
  severity,
  value,
}: {
  value: z.infer<typeof SeverityTypeSchema>
  severity: Severity
  selected: boolean
  onSelect: (values: any) => void
  onChange: (value: any) => void
}) {
  const feeForJuror = useJurorFee(process.env.NEXT_PUBLIC_KLEROS_DEFAULT_COURT as string)
  const [challengeBounty, setChallengeBounty] = useState(
    feeForJuror.data?.toString() || ZERO_BN.toString(),
  )

  const baseDeposit = feeForJuror.data
    ?.mul(value.amountOfJurors || 0)
    .add(challengeBounty || ZERO_BN)

  const baseDepositDisplayValue = formatUnits(baseDeposit || ZERO_BN)

  const onChangeJurors = useCallback(() => {
    // Do nothing, we prevent manual update
    return
  }, [])

  const handleClickDecrease = (e: MouseEvent) => {
    e.stopPropagation()
    const newAmountOfJurors = value.amountOfJurors - 2
    onChange({
      ...value,
      amountOfJurors: newAmountOfJurors <= 0 ? 1 : newAmountOfJurors,
    })
  }

  const handleClickIncrease = (e: MouseEvent) => {
    e.stopPropagation()
    const newAmountOfJurors = value.amountOfJurors + 2
    onChange({
      ...value,
      amountOfJurors: newAmountOfJurors % 2 === 0 ? 1 : newAmountOfJurors,
    })
  }

  const onChangeChallengeBounty = useCallback(
    (stringValue: string) => {
      setChallengeBounty(stringValue)
      onChange({
        ...value,
        challengeBounty: stringValue,
      })
    },
    [onChange, value],
  )

  const onSelectHandler = useCallback(() => {
    onSelect({
      amountOfJurors: SEVERITY_FEES[severity].amountOfJurors,
      challengeBounty: challengeBounty.toString(),
    })
  }, [challengeBounty, onSelect, severity])

  return (
    <CustomOptionPaper
      color={SEVERITY_COLORS[severity]}
      onClick={selected ? undefined : onSelectHandler}
      selected={selected}
    >
      <Stack>
        <Typography sx={{ fontSize: '12px !important' }}>Amount of Jurors</Typography>
        <VerySmallTextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  aria-label="decrease jurors"
                  edge="start"
                  onClick={handleClickDecrease}
                  sx={{ p: 0.5 }}
                >
                  <RemoveRoundedIcon sx={{ p: 0 }} />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="increase jurors"
                  edge="end"
                  onClick={handleClickIncrease}
                  sx={{ p: 0.5 }}
                >
                  <AddRoundedIcon sx={{ p: 0 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={onChangeJurors}
          size="small"
          value={value.amountOfJurors}
          variant="standard"
        />
      </Stack>

      <Stack>
        <Typography sx={{ fontSize: '12px !important' }}>Challenge Bounty</Typography>

        <BigNumberInput
          decimals={18}
          min={feeForJuror.data?.toString()}
          onChange={onChangeChallengeBounty}
          renderInput={(props) => (
            <Stack>
              <VerySmallTextField
                onChange={(e: ChangeEvent<HTMLInputElement>) => props.onChange && props.onChange(e)}
                size="small"
                value={props.value}
                variant="standard"
              />
            </Stack>
          )}
          value={challengeBounty}
        />
      </Stack>
      <Stack>
        <Typography sx={{ fontSize: '12px !important' }}>Base deposit</Typography>
        <Typography sx={{ fontSize: '14px !important' }}>{baseDepositDisplayValue}</Typography>
      </Stack>
    </CustomOptionPaper>
  )
}
