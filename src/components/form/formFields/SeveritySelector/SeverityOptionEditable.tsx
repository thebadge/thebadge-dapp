import { ChangeEvent, MouseEvent, useCallback, useState } from 'react'
import * as React from 'react'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { Box, Divider, IconButton, InputAdornment } from '@mui/material'
import { BigNumberInput } from 'big-number-input'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'
import { z } from 'zod'

import { CustomOptionPaper, Title, Value, ValueContainer, VerySmallTextField } from './styled'
import { SEVERITY_COLORS, SEVERITY_FEES } from './utilts'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { DEFAULT_COURT_ID } from '@/src/constants/common'
import { useJurorFee } from '@/src/hooks/kleros/useJurorFee'
import { Severity } from '@/types/utils'

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
  const { t } = useTranslation()
  const feeForJuror = useJurorFee(DEFAULT_COURT_ID)
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
      {selected && (
        <CheckCircleIcon
          color="green"
          sx={{ position: 'absolute', right: 0, top: 0, transform: 'translate(50%, -50%)' }}
        />
      )}

      <Box display="flex">
        <Box alignItems="center" flex="1">
          <Title>{t('severity.amountOfJurors')}</Title>
        </Box>
        <ValueContainer>
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
                    <RemoveRoundedIcon
                      sx={{ p: 0, fontSize: '1rem', color: SEVERITY_COLORS[severity] }}
                    />
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
                    <AddRoundedIcon
                      sx={{ p: 0, fontSize: '1rem', color: SEVERITY_COLORS[severity] }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fontColor={SEVERITY_COLORS[severity]}
            onChange={onChangeJurors}
            size="small"
            value={value.amountOfJurors}
            variant="standard"
          />
        </ValueContainer>
      </Box>

      <Divider color={SEVERITY_COLORS[severity]} />

      <Box display="flex">
        <Box alignItems="center" flex="1">
          <Title>{t('severity.challengeBounty')}</Title>
        </Box>
        <ValueContainer>
          <BigNumberInput
            decimals={18}
            min={feeForJuror.data?.toString()}
            onChange={onChangeChallengeBounty}
            renderInput={(props) => (
              <VerySmallTextField
                fontColor={SEVERITY_COLORS[severity]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => props.onChange && props.onChange(e)}
                size="small"
                sx={{ width: '85%' }}
                value={props.value}
                variant="standard"
              />
            )}
            value={challengeBounty}
          />
        </ValueContainer>
      </Box>

      <Divider color={SEVERITY_COLORS[severity]} />

      <Box display="flex">
        <Title>{t('severity.baseDeposit')}</Title>
        <ValueContainer>
          <Value color={SEVERITY_COLORS[severity]}>{baseDepositDisplayValue}</Value>
        </ValueContainer>
      </Box>
    </CustomOptionPaper>
  )
}
