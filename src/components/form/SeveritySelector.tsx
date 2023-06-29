import * as React from 'react'
import { useEffect, useState } from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Box,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  alpha,
  styled,
} from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import { colors, gradients } from 'thebadge-ui-library'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'
import { Disable } from '@/src/components/helpers/DisableElements'
import { Severity, Severity_Keys } from '@/types/utils'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  gridColumn: 'span 1 / span 2',
}))

const CustomSlider = styled(Slider)({
  height: '5px',
  '& .MuiSlider-track': {
    background: gradients.gradientHeader,
    border: 'none',
  },
  '& .MuiSlider-rail': {
    background: 'grey',
  },
})

const CustomOptionPaper = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'color',
})<{
  color: string
}>(({ color, theme }) => ({
  margin: theme.spacing(1),
  width: 160,
  height: 160,
  cursor: 'pointer',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  transition: 'all .3s cubic-bezier(0.65, 0, 0.35, 1)',
  background: alpha(color, 0.2),
  borderColor: alpha(color, 0.8),
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: theme.spacing(1),
  '&:hover': {
    background: alpha(color, 0.4),
    borderColor: color,
  },
}))

const VerySmallTextField = styled(TextField)(({ theme }) => ({
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

const marks = [
  {
    value: 1,
    label: Severity_Keys[0],
  },
  {
    value: 3,
    label: Severity_Keys[1],
  },
  {
    value: 5,
    label: Severity_Keys[2],
  },
]

type SeveritySelectorProps = {
  error?: FieldError
  label?: string
  onChange: (value: any) => void
  placeholder?: string
  value: z.infer<typeof SeverityTypeSchema> | undefined
}

// TODO Do it with HTML to have a better look and feel
const numberOfJurorExplanations =
  'This determines how many jurors will be drawn in the first round of any eventual disputes involving your list. In general, a standard number is 3. In cases where the decision is straightforward and not much effort is required, one juror might be sufficient. In situations where significant effort is required to review the case, it can be better to require more jurors. However, if you set a higher number of initial jurors, this will result in larger deposits being required by users which may result in a lower amount of submissions.'
const feePerJurorExplanation =
  'The fees works as incentive for each juror, and it is determined by the court'
const challengeBountyExplanation =
  'This is the part of the deposit that is awarded to successful challengers. If the value is too low, challengers may not have enough incentive to look for flaws in the submissions and bad ones could make it through. If it is too high, submitters may not have enough incentive to send items which may result in an empty list.'
const baseDepositExplanation =
  'These are the funds users will have to deposit in order to make a submission into the list, which are sufficient to cover both arbitration costs paid to jurors and the rewards that users earn for a successful challenge. If the deposit is too low, incorrect submissions may not be flagged for dispute which could result in incorrect items being accepted in the list. If the deposit is too high, challengers will be likely to catch most malicious submissions, but people will only rarely submit to your list (so you may end up having a list that is difficult to attack but largely empty).'

export function SeveritySelector({ error, label, onChange, placeholder }: SeveritySelectorProps) {
  const [auxValue, setAuxValue] = useState<number>(1)

  const [enableAdvance, setAdvanceMode] = useState<boolean>(false)

  useEffect(() => {
    // Use effect to set the default value, is made on this way to
    // prevent the use of default props on the form
    onChange(Severity[auxValue])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      setAuxValue(newValue)
      onChange(Severity[newValue])
    }
  }

  function valuetext(value: number) {
    return Severity[value]
  }

  function valueLabelFormat(value: number) {
    return Severity[value]
  }

  function toggleAdvanceMode(enable: boolean) {
    setAdvanceMode(enable)
    if (!enable) {
      setAuxValue(1)
      onChange(Severity[1])
    }
  }

  return (
    <Wrapper sx={{ px: 2 }}>
      <FormField
        formControl={
          <Box display="flex" flex={1} flexDirection="column" width="100%">
            <Disable disabled={enableAdvance} sx={{ width: '100%' }}>
              <CustomSlider
                aria-label="Severity-court"
                color="secondary"
                defaultValue={30}
                getAriaValueText={valuetext}
                marks={marks}
                max={5}
                min={1}
                onChange={handleChange}
                step={2}
                sx={{
                  minWidth: '200px',
                }}
                value={auxValue}
                valueLabelDisplay="auto"
                valueLabelFormat={valueLabelFormat}
              />
            </Disable>
          </Box>
        }
        label={
          <Typography color="text.disabled" ml={-2}>
            {label}
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={enableAdvance}
                  onChange={() => toggleAdvanceMode(!enableAdvance)}
                />
              }
              label={'Advance'}
              sx={{ position: 'absolute', right: 0, mr: 0 }}
            />
          </Typography>
        }
        labelPosition={'top-left'}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.message}
      />
      {enableAdvance && (
        <Stack gap={1}>
          <Box display="flex" justifyContent="space-between">
            {/* 1 juror with normal reward on challenges */}
            <CustomOptionPaper color={colors.greenLight}>
              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Amount of Jurors</Typography>
                <Typography sx={{ fontSize: '14px !important' }}>1</Typography>
              </Stack>

              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Challenge Bounty</Typography>
                <Typography sx={{ fontSize: '14px !important' }}>0.02</Typography>
              </Stack>

              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Base deposit</Typography>
                <Typography sx={{ fontSize: '14px !important' }}>0.05</Typography>
              </Stack>
            </CustomOptionPaper>

            {/* 3 jurors with normal reward on challenges */}
            <CustomOptionPaper color={colors.purple}>
              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Amount of Jurors</Typography>
                <Typography sx={{ fontSize: '14px !important' }}>3</Typography>
              </Stack>

              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Challenge Bounty</Typography>
                <Typography sx={{ fontSize: '14px !important' }}>0.03</Typography>
              </Stack>

              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Base deposit</Typography>
                <Typography sx={{ fontSize: '14px !important' }}>0.08</Typography>
              </Stack>
            </CustomOptionPaper>

            {/* 3 jurors with high reward on challenges */}
            <CustomOptionPaper color={colors.pink}>
              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Amount of Jurors</Typography>
                <Typography sx={{ fontSize: '14px !important' }}>3</Typography>
              </Stack>

              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Challenge Bounty</Typography>
                <Typography sx={{ fontSize: '14px !important' }}>0.06</Typography>
              </Stack>

              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Base deposit</Typography>
                <Typography sx={{ fontSize: '14px !important' }}>0.12</Typography>
              </Stack>
            </CustomOptionPaper>

            {/* editable */}
            <CustomOptionPaper color={colors.deepPurple}>
              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Amount of Jurors</Typography>
                <VerySmallTextField id="standard-basic" size="small" value="3" variant="standard" />
              </Stack>

              <Stack>
                <Typography sx={{ fontSize: '12px !important' }}>Challenge Bounty</Typography>
                <VerySmallTextField
                  id="standard-basic"
                  size="small"
                  value="0.003"
                  variant="standard"
                />
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
            Amount of Jurors: <strong>1</strong>
          </Typography>
          <Typography sx={{ fontSize: '12px !important' }}>
            <Tooltip arrow title={feePerJurorExplanation}>
              <InfoOutlinedIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            </Tooltip>
            Fee per Juror: <strong>0.02</strong>
          </Typography>
          <Typography sx={{ fontSize: '12px !important' }}>
            <Tooltip arrow title={challengeBountyExplanation}>
              <InfoOutlinedIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            </Tooltip>
            Challenge Bounty: <strong>0.01</strong>
          </Typography>
          <Typography sx={{ fontSize: '12px !important' }}>
            <Tooltip arrow title={baseDepositExplanation}>
              <InfoOutlinedIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            </Tooltip>
            Base deposit: <strong>0.03</strong>
          </Typography>
          <Typography sx={{ fontSize: '12px !important' }}>Court: -</Typography>
        </Stack>
      )}
    </Wrapper>
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function SeveritySelectorWithTSForm() {
  const { error, field } = useTsController<z.infer<typeof SeverityTypeSchema>>()
  const { label, placeholder } = useDescription()

  function onChange(value: z.infer<typeof SeverityTypeSchema>) {
    field.onChange(value)
  }

  return (
    <SeveritySelector
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={field.value}
    />
  )
}
