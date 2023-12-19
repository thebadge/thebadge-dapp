import { useCallback } from 'react'
import * as React from 'react'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Divider } from '@mui/material'
import { formatUnits } from 'ethers/lib/utils'
import useTranslation from 'next-translate/useTranslation'
import { z } from 'zod'

import { CustomOptionPaper, Title, Value, ValueContainer } from './styled'
import { SEVERITY_COLORS, SEVERITY_FEES } from './utilts'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { DEFAULT_COURT_ID } from '@/src/constants/common'
import { useJurorFee } from '@/src/hooks/kleros/useJurorFee'
import { Severity } from '@/types/utils'

export default function SeverityOptionItem({
  onSelect,
  selected,
  severity,
}: {
  severity: Severity
  selected: boolean
  onSelect: (values: z.infer<typeof SeverityTypeSchema._def.type>) => void
}) {
  const { t } = useTranslation()
  const feeForJuror = useJurorFee(DEFAULT_COURT_ID)

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
          <Value color={SEVERITY_COLORS[severity]}>{SEVERITY_FEES[severity].amountOfJurors}</Value>
        </ValueContainer>
      </Box>

      <Divider color={SEVERITY_COLORS[severity]} />

      <Box display="flex">
        <Box alignItems="center" flex="1">
          <Title>{t('severity.challengeBounty')}</Title>
        </Box>
        <ValueContainer>
          <Value color={SEVERITY_COLORS[severity]}>{challengeBountyDisplay}</Value>
        </ValueContainer>
      </Box>

      <Divider color={SEVERITY_COLORS[severity]} />

      <Box display="flex">
        <Box alignItems="center" display="flex" flex="1">
          <Title>{t('severity.baseDeposit')}</Title>
        </Box>
        <ValueContainer>
          <Value color={SEVERITY_COLORS[severity]}>{baseDepositDisplayValue}</Value>
        </ValueContainer>
      </Box>
    </CustomOptionPaper>
  )
}
