import { useCallback } from 'react'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined'
import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'
import { z } from 'zod'

import SeverityOptionEditable from '@/src/components/form/formFields/SeveritySelector/SeverityOptionEditable'
import SeverityOptionItem from '@/src/components/form/formFields/SeveritySelector/SeverityOptionItem'
import { DisplayLabel } from '@/src/components/form/formFields/SeveritySelector/styled'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { DEFAULT_COURT_ID } from '@/src/constants/common'
import { useJurorFee } from '@/src/hooks/kleros/useJurorFee'
import { Severity } from '@/types/utils'

// TODO Do it with HTML to have a better look and feel
const numberOfJurorExplanations =
  'This determines how many jurors will be drawn in the first round of any eventual disputes involving your list. In general, a standard number is 3. In cases where the decision is straightforward and not much effort is required, one juror might be sufficient. In situations where significant effort is required to review the case, it can be better to require more jurors. However, if you set a higher number of initial jurors, this will result in larger deposits being required by users which may result in a lower amount of submissions.'
const feePerJurorExplanation =
  'The fees works as incentive for each juror, and it is determined by the court'
const challengeBountyExplanation =
  'This is the part of the deposit that is awarded to successful challengers. If the value is too low, challengers may not have enough incentive to look for flaws in the submissions and bad ones could make it through. If it is too high, submitters may not have enough incentive to send items which may result in an empty list.'
const baseDepositExplanation =
  'These are the funds users will have to deposit in order to make a submission into the list, which are sufficient to cover both arbitration costs paid to jurors and the rewards that users earn for a successful challenge. If the deposit is too low, incorrect submissions may not be flagged for dispute which could result in incorrect items being accepted in the list. If the deposit is too high, challengers will be likely to catch most malicious submissions, but people will only rarely submit to your list (so you may end up having a list that is difficult to attack but largely empty).'

export default function SeveritySelectorAdvanceView({
  onChange,
  onOptionSelectedChange,
  optionSelected,
  value,
}: {
  onChange: (value: any) => void
  value: z.infer<typeof SeverityTypeSchema>
  optionSelected: number
  onOptionSelectedChange: (value: number) => void
}) {
  const { t } = useTranslation()
  /**
   * Default Kleros court to use when creating a new badge model.
   * TODO: we should set a default court in the short-circuit to the Kleros's  general court.
   * In advance mode the user should be able to select the court.
   */
  const feeForJuror = useJurorFee(DEFAULT_COURT_ID)
  const feeForJurorDisplayValue = formatUnits(feeForJuror.data || ZERO_BN)

  const baseDeposit = feeForJuror.data?.mul(value?.amountOfJurors || 1).add(value?.challengeBounty)

  const baseDepositDisplayValue = formatUnits(baseDeposit || ZERO_BN)

  const handleOptionSelection = useCallback(
    (opt: number, values: any) => {
      onOptionSelectedChange(opt)
      onChange(values)
    },
    [onChange, onOptionSelectedChange],
  )

  const handleEdition = useCallback(
    (values: any) => {
      onChange(values)
    },
    [onChange],
  )

  return (
    <Stack gap={1}>
      <Box display="flex" justifyContent="space-between">
        {/* 1 juror with normal reward on challenges */}
        <SafeSuspense>
          <SeverityOptionItem
            onSelect={(values) => handleOptionSelection(Severity.Normal, values)}
            selected={optionSelected === Severity.Normal}
            severity={Severity.Normal}
          />
        </SafeSuspense>

        {/* 3 jurors with normal reward on challenges */}
        <SafeSuspense>
          <SeverityOptionItem
            onSelect={(values) => handleOptionSelection(Severity['Above average'], values)}
            selected={optionSelected === Severity['Above average']}
            severity={Severity['Above average']}
          />
        </SafeSuspense>

        {/* 3 jurors with high reward on challenges */}
        <SafeSuspense>
          <SeverityOptionItem
            onSelect={(values) => handleOptionSelection(Severity.Heavy, values)}
            selected={optionSelected === Severity.Heavy}
            severity={Severity.Heavy}
          />
        </SafeSuspense>

        {/* editable */}
        <SafeSuspense>
          <SeverityOptionEditable
            onChange={handleEdition}
            onSelect={(values) => handleOptionSelection(Severity.Custom, values)}
            selected={optionSelected === Severity.Custom}
            severity={Severity.Custom}
            value={value}
          />
        </SafeSuspense>
      </Box>

      <Stack gap={2} mt={1}>
        <Box sx={{ display: 'flex', gap: 1, borderBottom: `1px solid ${colors.purple}` }}>
          <SummarizeOutlinedIcon sx={{ color: colors.purple }} />
          <Typography color={colors.purple} fontWeight={700}>
            {t('severity.display.summary')}
          </Typography>
        </Box>
        <Stack gap={2}>
          <Box display="flex" gap={3}>
            <DisplayLabel>
              <Tooltip arrow title={t('severity.display.numberOfJurorExplanations')}>
                <InfoOutlinedIcon sx={{ mr: 0.5 }} />
              </Tooltip>
              <strong>{t('severity.display.amountOfJurors')}</strong> {value?.amountOfJurors}
            </DisplayLabel>

            <DisplayLabel>
              <Tooltip arrow title={feePerJurorExplanation}>
                <InfoOutlinedIcon sx={{ mr: 0.5 }} />
              </Tooltip>
              <strong>{t('severity.display.feePerJuror')}</strong> {feeForJurorDisplayValue}
            </DisplayLabel>

            <DisplayLabel>
              <Tooltip arrow title={t('severity.display.challengeBountyExplanation')}>
                <InfoOutlinedIcon sx={{ mr: 0.5 }} />
              </Tooltip>
              <strong>{t('severity.display.challengeBounty')}</strong>{' '}
              {formatUnits(value?.challengeBounty)}
            </DisplayLabel>
          </Box>
          <Box display="flex" gap={3}>
            <DisplayLabel>
              <Tooltip arrow title={t('severity.display.baseDepositExplanation')}>
                <InfoOutlinedIcon sx={{ mr: 0.5 }} />
              </Tooltip>
              <strong>{t('severity.display.baseDeposit')}</strong> {baseDepositDisplayValue}
            </DisplayLabel>

            <DisplayLabel>
              <Tooltip arrow title={t('severity.display.courtExplanation')}>
                <InfoOutlinedIcon sx={{ mr: 0.5 }} />
              </Tooltip>
              <strong>{t('severity.display.court')}</strong> General
            </DisplayLabel>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  )
}
