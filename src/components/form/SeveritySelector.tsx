import * as React from 'react'
import { useState } from 'react'

import InfoIcon from '@mui/icons-material/Info'
import { Box, Slider, Tooltip, Typography, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { Severity } from '@/types/utils'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  width: '50%',
}))

export default function SeveritySelector() {
  const { error, field } = useTsController<z.infer<typeof SeverityTypeSchema>>()
  const { label } = useDescription()
  const [value, setValue] = useState<number>(1)

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
    <Wrapper>
      <FormField
        formControl={
          <Box display="flex" flex={1} flexDirection="column">
            <Slider
              aria-label="Severity-court"
              color="primary"
              defaultValue={30}
              marks
              max={5}
              min={1}
              onChange={handleChange}
              step={2}
              sx={{ minWidth: '200px' }}
              value={value}
              valueLabelDisplay="auto"
              valueLabelFormat={valueLabelFormat}
            />
            <Typography>
              {valuetext(value)}
              <Tooltip title={`Depending on how much severity you require, the court.......`}>
                <InfoIcon sx={{ ml: 1 }} />
              </Tooltip>
            </Typography>
          </Box>
        }
        label={label}
        labelPosition={'top'}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.errorMessage}
      />
    </Wrapper>
  )
}
