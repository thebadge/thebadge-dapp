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
import { useTranslation } from 'next-export-i18n'
import { FieldError } from 'react-hook-form'
import { z } from 'zod'

import SeveritySelectorAdvanceView from '@/src/components/form/SeveritySelector/AdvanceView'
import { getDefaultConfigs } from '@/src/components/form/SeveritySelector/utilts'
import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { FormStatus } from '@/src/components/form/helpers/FormStatus'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'
import { Disable } from '@/src/components/helpers/DisableElements'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { DEFAULT_COURT_ID } from '@/src/constants/common'
import { useJurorFee } from '@/src/hooks/kleros/useJurorFee'
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
  error?: FieldError & { amountOfJurors?: FieldError; challengeBounty?: FieldError }
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
  const { t } = useTranslation()
  /**
   * Default Kleros court to use when creating a new badge model.
   * TODO: we should set a default court in the short-circuit to the Kleros's  general court.
   * In advance mode the user should be able to select the court.
   */
  const feeForJuror = useJurorFee(DEFAULT_COURT_ID)

  const [optionSelectedAuxIndex, setOptionSelectedAuxIndex] = useState<number>(1)

  const [enableAdvance, setAdvanceMode] = useState<boolean>(true)

  const hasInternalError = error?.amountOfJurors || error?.challengeBounty

  const hasInternalError = error?.amountOfJurors || error?.challengeBounty

  const handleChange = (e: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      setOptionSelectedAuxIndex(newValue)
      onChange(getDefaultConfigs(newValue, feeForJuror.data))
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
      setOptionSelectedAuxIndex(Severity.Normal)
      onChange(getDefaultConfigs(Severity.Normal, feeForJuror.data))
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
                value={optionSelectedAuxIndex}
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
              label={t('severity.advance')}
              sx={{ position: 'absolute', right: 0, mr: 0 }}
            />
          </Typography>
        }
        labelPosition={'top-left'}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.message}
      />
      {hasInternalError && (
        <FormStatus status={TextFieldStatus.error}>{hasInternalError?.message}</FormStatus>
      )}
      {enableAdvance && (
        <SafeSuspense
          fallback={<Skeleton animation="wave" height="100%" variant="rounded" width={150} />}
        >
          <SeveritySelectorAdvanceView
            onChange={onChange}
            onOptionSelectedChange={(aux) => setOptionSelectedAuxIndex(aux)}
            optionSelected={optionSelectedAuxIndex}
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
      value={field.value as z.infer<typeof SeverityTypeSchema>}
    />
  )
}
