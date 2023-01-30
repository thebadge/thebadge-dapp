import { useState } from 'react'
import * as React from 'react'

import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Select as MUISelect,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Tooltip,
  styled,
} from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import dayjs from 'dayjs'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { ExpirationTypeSchema } from '@/src/components/form/helpers/customSchemas'

const options = ['day', 'month', 'year']

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  width: '50%',
}))

export default function ExpirationField() {
  const { error, field } = useTsController<z.infer<typeof ExpirationTypeSchema>>()
  const { label } = useDescription()
  const [unit, setUnit] = useState<'day' | 'month' | 'year'>('day')

  function onChange(e: any) {
    field.onChange(e.target.value.replace(/[^0-9.]/g, ''))
  }

  function validTo(days?: z.infer<typeof ExpirationTypeSchema>) {
    if (!days) return '-'
    return dayjs().add(days, unit).format('DD/MM/YYYY')
  }

  function handleDropdownChange(e: SelectChangeEvent) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setUnit(e.target.value)
  }

  return (
    <Wrapper>
      <FormField
        formControl={
          <Box>
            <TextField
              InputProps={{
                endAdornment: (
                  <Tooltip
                    title={`e.g. If you mint this badge today, It will expire on: ${validTo(
                      field.value,
                    )}`}
                  >
                    <InfoIcon />
                  </Tooltip>
                ),
              }}
              color="secondary"
              error={!!error}
              helperText={error?.errorMessage}
              label={label}
              onChange={onChange}
              value={field.value ? field.value : ''}
              variant={'standard'}
            />
            <MUISelect
              id="unit-select"
              onChange={handleDropdownChange}
              sx={{ textTransform: 'capitalize', ml: 2 }}
              value={unit || ''}
            >
              {options.map((op) => {
                return (
                  <MenuItem key={op} sx={{ textTransform: 'capitalize' }} value={op}>
                    {op}s
                  </MenuItem>
                )
              })}
            </MUISelect>
          </Box>
        }
        labelPosition={'top'}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.errorMessage}
      />
    </Wrapper>
  )
}
