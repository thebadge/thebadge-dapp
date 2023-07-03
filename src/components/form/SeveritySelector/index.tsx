import * as React from 'react'
import { useState } from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Box,
  FormControlLabel,
  Skeleton,
  Slider,
  Switch,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import { gradients } from '@thebadge/ui-library'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import { z } from 'zod'

import SeveritySelectorAdvanceView from '@/src/components/form/SeveritySelector/AdvanceView'
import { getDefaultConfigs } from '@/src/components/form/SeveritySelector/utilts'
import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'
import { Disable } from '@/src/components/helpers/DisableElements'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
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
  value: z.infer<typeof SeverityTypeSchema>
}

export function SeveritySelector({
  error,
  label,
  onChange,
  placeholder,
  value,
}: SeveritySelectorProps) {
  const [auxValue, setAuxValue] = useState<number>(1)

  const [enableAdvance, setAdvanceMode] = useState<boolean>(false)

  const handleChange = (e: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      setAuxValue(newValue)
      onChange(getDefaultConfigs(newValue))
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
      setAuxValue(Severity.Normal)
      onChange(getDefaultConfigs(Severity.Normal))
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
        <SafeSuspense
          fallback={<Skeleton animation="wave" height="100%" variant="rounded" width={150} />}
        >
          <SeveritySelectorAdvanceView
            onChange={onChange}
            onOptionSelectedChange={(aux) => setAuxValue(aux)}
            optionSelected={auxValue}
            value={value}
          />
        </SafeSuspense>
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