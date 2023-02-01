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
      field.onChange(Number(cleanValue))
    }
  }

  function validTo(days?: z.infer<typeof ExpirationTypeSchema>) {
    if (!days || days === 0) return 'End of time.'
    return dayjs().add(days, unit).format('DD/MM/YYYY')
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
                  <InfoIcon />
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
      statusText={error?.errorMessage}
    />
  )
}
