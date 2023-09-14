import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Slider, Tooltip, Typography, styled } from '@mui/material'
import { gradients } from '@thebadge/ui-library'
import { FieldError } from 'react-hook-form'

import { TextFieldStatus } from '@/src/components/form/formFields/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
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

type PeriodSelectorProps = {
  error?: FieldError
  label?: string
  onChange: (value: any) => void
  placeholder?: string
  value: number | undefined
  maxValue: number
  minValue: number
}

export function PeriodSelector({
  error,
  label,
  maxValue = 100,
  minValue = 1,
  onChange,
  placeholder,
  value,
}: PeriodSelectorProps) {
  const handleChange = (e: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      onChange(newValue)
    }
  }

  function valuetext(value: number) {
    return `${value} days`
  }

  function valueLabelFormat(value: number) {
    return `${value} days`
  }

  return (
    <Wrapper sx={{ px: 2 }}>
      <FormField
        formControl={
          <Box display="flex" flex={1} flexDirection="column" width="100%">
            <CustomSlider
              aria-label="period-duration"
              color="primary"
              defaultValue={2}
              getAriaValueText={valuetext}
              marks={[
                {
                  value: minValue,
                  label: `${minValue || 1} days`,
                },
                {
                  value: maxValue,
                  label: `${maxValue} days`,
                },
              ]}
              max={maxValue}
              min={minValue}
              onChange={handleChange}
              step={1}
              sx={{ minWidth: '200px' }}
              value={value}
              valueLabelDisplay="auto"
              valueLabelFormat={valueLabelFormat}
            />
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
          </Typography>
        }
        labelPosition={'top-left'}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.message}
      />
    </Wrapper>
  )
}
