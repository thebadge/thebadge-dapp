import { useCallback } from 'react'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Stack, TextField, Tooltip, Typography, alpha, styled } from '@mui/material'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import SeverityOptionItem from '@/src/components/form/SeveritySelector/SeverityOptionItem'
import { getDefaultConfigs } from '@/src/components/form/SeveritySelector/utilts'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
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
  /**
   * Default Kleros court to use when creating a new badge model.
   * TODO: we should set a default court in the short-circuit to the Kleros's  general court.
   * In advance mode the user should be able to select the court.
   */
  const feeForJuror = useJurorFee(process.env.NEXT_PUBLIC_KLEROS_DEFAULT_COURT as string)
  const feeForJurorDisplayValue = formatUnits(feeForJuror.data || ZERO_BN)

  const baseDeposit = feeForJuror.data
    ?.mul(value?.amountOfJurors)
    .add(parseUnits(value?.challengeBounty))

  const baseDepositDisplayValue = formatUnits(baseDeposit || ZERO_BN)

  const handleOptionSelection = useCallback(
    (opt: number) => {
      onOptionSelectedChange(opt)
      if (opt !== Severity.Custom) {
        onChange(getDefaultConfigs(opt))
      }
    },
    [onChange, onOptionSelectedChange],
  )

  return (
    <Stack gap={1}>
      <Box display="flex" justifyContent="space-between">
        {/* 1 juror with normal reward on challenges */}
        <SafeSuspense>
          <SeverityOptionItem
            onSelect={() => handleOptionSelection(Severity.Normal)}
            selected={optionSelected === Severity.Normal}
            severity={Severity.Normal}
          />
        </SafeSuspense>

        {/* 3 jurors with normal reward on challenges */}
        <SafeSuspense>
          <SeverityOptionItem
            onSelect={() => handleOptionSelection(Severity['Above average'])}
            selected={optionSelected === Severity['Above average']}
            severity={Severity['Above average']}
          />
        </SafeSuspense>

        {/* 3 jurors with high reward on challenges */}
        <SafeSuspense>
          <SeverityOptionItem
            onSelect={() => handleOptionSelection(Severity.Heavy)}
            selected={optionSelected === Severity.Heavy}
            severity={Severity.Heavy}
          />
        </SafeSuspense>

        {/* editable */}
        <CustomOptionPaper
          color={colors.deepPurple}
          onClick={() => handleOptionSelection(Severity.Custom)}
          selected={optionSelected === Severity.Custom}
        >
          <Stack>
            <Typography sx={{ fontSize: '12px !important' }}>Amount of Jurors</Typography>
            <VerySmallTextField id="standard-basic" size="small" value="3" variant="standard" />
          </Stack>

          <Stack>
            <Typography sx={{ fontSize: '12px !important' }}>Challenge Bounty</Typography>
            <VerySmallTextField id="standard-basic" size="small" value="0.003" variant="standard" />
          </Stack>
          <Stack>
            <Typography sx={{ fontSize: '12px !important' }}>Base deposit</Typography>
            <Typography sx={{ fontSize: '14px !important' }}>0.08</Typography>
          </Stack>
        </CustomOptionPaper>
      </Box>
      <Typography sx={{ fontSize: '12px !important' }}>
        <Tooltip arrow title={numberOfJurorExplanations}>
          <InfoOutlinedIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
        </Tooltip>
        Amount of Jurors: <strong>{value?.amountOfJurors}</strong>
      </Typography>
      <Typography sx={{ fontSize: '12px !important' }}>
        <Tooltip arrow title={feePerJurorExplanation}>
          <InfoOutlinedIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
        </Tooltip>
        Fee per Juror:
        <strong> {feeForJurorDisplayValue}</strong>
      </Typography>
      <Typography sx={{ fontSize: '12px !important' }}>
        <Tooltip arrow title={challengeBountyExplanation}>
          <InfoOutlinedIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
        </Tooltip>
        Challenge Bounty: <strong>{value?.challengeBounty}</strong>
      </Typography>
      <Typography sx={{ fontSize: '12px !important' }}>
        <Tooltip arrow title={baseDepositExplanation}>
          <InfoOutlinedIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
        </Tooltip>
        Base deposit: <strong>{baseDepositDisplayValue}</strong>
      </Typography>
      <Typography sx={{ fontSize: '12px !important' }}>Court: -</Typography>
    </Stack>
  )
}
