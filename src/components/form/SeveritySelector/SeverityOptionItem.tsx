import { useCallback } from 'react'
import * as React from 'react'

import { Box, Stack, Typography, alpha, styled } from '@mui/material'
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

export default function SeverityOptionItem({
  onSelect,
  selected,
  severity,
}: {
  severity: Severity
  selected: boolean
  onSelect: (values: z.infer<typeof SeverityTypeSchema._def.type>) => void
}) {
  const feeForJuror = useJurorFee(process.env.NEXT_PUBLIC_KLEROS_DEFAULT_COURT as string)

  const challengeBounty =
    feeForJuror.data?.mul(SEVERITY_FEES[severity].challengeBountyMultiplier || 0) || ZERO_BN

  const challengeBountyDisplay = formatUnits(challengeBounty || ZERO_BN)

  const baseDeposit = feeForJuror.data
    ?.mul(SEVERITY_FEES[severity].amountOfJurors || 0)
    .add(challengeBounty)

  const baseDepositDisplayValue = formatUnits(baseDeposit || ZERO_BN)

  const onSelectHandler = useCallback(() => {
    onSelect({
      amountOfJurors: SEVERITY_FEES[severity].amountOfJurors,
      challengeBounty: challengeBounty.toString(),
    })
  }, [challengeBounty, onSelect, severity])

  return (
    <CustomOptionPaper
      color={SEVERITY_COLORS[severity]}
      onClick={onSelectHandler}
      selected={selected}
    >
      <Stack>
        <Typography sx={{ fontSize: '12px !important' }}>Amount of Jurors</Typography>
        <Typography sx={{ fontSize: '14px !important' }}>
          {SEVERITY_FEES[severity].amountOfJurors}
        </Typography>
      </Stack>

      <Stack>
        <Typography sx={{ fontSize: '12px !important' }}>Challenge Bounty</Typography>
        <Typography sx={{ fontSize: '14px !important' }}>{challengeBountyDisplay}</Typography>
      </Stack>

      <Stack>
        <Typography sx={{ fontSize: '12px !important' }}>Base deposit</Typography>
        <Typography sx={{ fontSize: '14px !important' }}>{baseDepositDisplayValue}</Typography>
      </Stack>
    </CustomOptionPaper>
  )
}
