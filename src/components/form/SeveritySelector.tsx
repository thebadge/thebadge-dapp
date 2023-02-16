import * as React from 'react'
import { useEffect, useState } from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Slider, Tooltip, Typography, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { gradients } from 'thebadge-ui-library'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
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
})

const marks = [
  {
    value: 1,
    label: Severity_Keys[0],
  },
  {
    value: 5,
    label: Severity_Keys[2],
  },
]

export default function SeveritySelector() {
  const { error, field } = useTsController<z.infer<typeof SeverityTypeSchema>>()
  const { label, placeholder } = useDescription()
  const [value, setValue] = useState<number>(1)

  useEffect(() => {
    // Use effect to set the default value, is made on this way to
    // prevent the use of default props on the form
    field.onChange(Severity[value])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      setValue(newValue)
      field.onChange(Severity[newValue])
    }
  }

  function valuetext(value: number) {
    return Severity[value]
  }

  function valueLabelFormat(value: number) {
    return Severity[value]
  }

  return (
    <Wrapper sx={{ px: 2 }}>
      <FormField
        formControl={
          <Box display="flex" flex={1} flexDirection="column">
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
              sx={{ minWidth: '200px' }}
              value={value}
              valueLabelDisplay="auto"
              valueLabelFormat={valueLabelFormat}
            />
          </Box>
        }
        label={
          <Typography>
            {label}
            <Tooltip title={placeholder}>
              <InfoOutlinedIcon sx={{ ml: 1 }} />
            </Tooltip>
          </Typography>
        }
        labelPosition={'top'}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.errorMessage}
      />
    </Wrapper>
  )
}
