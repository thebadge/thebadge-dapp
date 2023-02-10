import { useState } from 'react'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
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
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'end',
  position: 'relative',
  rowGap: theme.spacing(1),
}))

export default function ExpirationField() {
  const { error, field } = useTsController<z.infer<typeof ExpirationTypeSchema>>()
  const { label, placeholder } = useDescription()
  const [stringValue, setStringValue] = useState<string>('')

  const [unit, setUnit] = useState<'day' | 'month' | 'year'>('day')

  function onChange(e: any) {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, '') || '0'
    if (/^-?\d+(?:\.\d*)?$/.test(cleanValue)) {
      setStringValue(cleanValue)
      field.onChange(parseToSeconds(cleanValue, unit))
    }
  }

  function handleDropdownChange(e: SelectChangeEvent) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setUnit(e.target.value)
  }

  return (
    <FormField
      formControl={
        <Wrapper>
          <TextField
            InputProps={{
              endAdornment: (
                <Tooltip
                  title={
                    placeholder +
                    `\n e.g. If you mint this badge today, It will expire on: ${validTo(
                      field.value,
                    )}`
                  }
                >
                  <InfoOutlinedIcon />
                </Tooltip>
              ),
            }}
            color="secondary"
            onChange={onChange}
            sx={{ justifyContent: 'end' }}
            value={stringValue}
            variant={'standard'}
          />
          <MUISelect
            id="unit-select"
            onChange={handleDropdownChange}
            size="small"
            sx={{ textTransform: 'capitalize', ml: 2 }}
            value={unit || ''}
            variant="standard"
          >
            {options.map((op) => {
              return (
                <MenuItem key={op} sx={{ textTransform: 'capitalize' }} value={op}>
                  {op}s
                </MenuItem>
              )
            })}
          </MUISelect>
        </Wrapper>
      }
      label={label}
      labelPosition={'top'}
      status={error ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error ? error?.errorMessage : ' '}
    />
  )
}

function validTo(days?: z.infer<typeof ExpirationTypeSchema>) {
  if (!days || days === 0) return 'End of time.'
  return dayjs().add(days, 'seconds').format('DD/MM/YYYY')
}

function parseToSeconds(value: string, unit: 'day' | 'month' | 'year') {
  switch (unit) {
    case 'day':
      return Number(value) * 24 * 60 * 60 // Each day has 24hs and each hour has 60 min, each min has 60 seconds
    case 'month':
      return Number(value) * 30 * 24 * 60 * 60 // Each month has 30 days as default
    case 'year':
      return Number(value) * 360 * 24 * 60 * 60 // Each year has 360 days as default
  }
}
