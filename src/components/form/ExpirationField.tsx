import { useEffect, useState } from 'react'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Box,
  FormControlLabel,
  Checkbox as MUICheckbox,
  Select as MUISelect,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import dayjs from 'dayjs'
import { FieldError } from 'react-hook-form'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { ExpirationTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

type TimeUnit = 'day' | 'month' | 'year'
const options = ['day', 'month', 'year']

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  position: 'relative',
}))

type ExpirationFieldProps = {
  error?: FieldError
  label?: string
  onChange: (value: number) => void
  placeholder?: string
  value: z.infer<typeof ExpirationTypeSchema> | undefined
}

export function ExpirationField({
  error,
  label,
  onChange,
  placeholder,
  value,
}: ExpirationFieldProps) {
  const [stringValue, setStringValue] = useState<string>('')
  const [enableExpiration, setEnableExpiration] = useState<boolean>(false)

  const [unit, setUnit] = useState<TimeUnit>('day')

  useEffect(() => {
    // Easy way to set default value
    onChange(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setExpiration(value: string) {
    setStringValue(value)
    onChange(parseToSeconds(value, unit))
  }

  function handleOnChange(e: any) {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, '') || '0'
    if (/^-?\d+(?:\.\d*)?$/.test(cleanValue)) {
      setExpiration(cleanValue)
    }
  }

  function handleDropdownChange(e: SelectChangeEvent<TimeUnit>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const newUnit: TimeUnit = e.target.value
    setUnit(newUnit)
    onChange(parseToSeconds(stringValue, newUnit))
  }

  function toggleExpiration(enable: boolean) {
    setEnableExpiration(enable)
    if (!enable) {
      onChange(0) // if disable expiration, reset the values
      setExpiration('0')
      setUnit('day')
    }
  }

  return (
    <FormField
      formControl={
        <div>
          <Box alignItems="center" display="flex">
            <FormControlLabel
              control={
                <MUICheckbox
                  checked={enableExpiration}
                  onChange={() => toggleExpiration(!enableExpiration)}
                  sx={{ width: 'fit-content' }}
                />
              }
              label={<Typography>Enable expiration time</Typography>}
              sx={{ my: 1 }}
            />
          </Box>

          <Wrapper>
            {enableExpiration && (
              <>
                <TextField
                  InputProps={{
                    endAdornment: (
                      <Tooltip
                        arrow
                        title={
                          placeholder +
                          `\n e.g. If you mint this badge today, It will expire on: ${validTo(
                            value,
                          )}`
                        }
                      >
                        <InfoOutlinedIcon />
                      </Tooltip>
                    ),
                  }}
                  color="secondary"
                  label={label}
                  onChange={handleOnChange}
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
                  variant="filled"
                >
                  {options.map((op) => {
                    return (
                      <MenuItem key={op} sx={{ textTransform: 'capitalize' }} value={op}>
                        {op}s
                      </MenuItem>
                    )
                  })}
                </MUISelect>
              </>
            )}
          </Wrapper>
        </div>
      }
      labelPosition={'top'}
      status={error ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error ? error?.message : ' '}
    />
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function ExpirationFieldWithTSForm() {
  const { error, field } = useTsController<z.infer<typeof ExpirationTypeSchema>>()
  const { label, placeholder } = useDescription()

  function onChange(value: number) {
    field.onChange(value)
  }

  return (
    <ExpirationField
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={field.value}
    />
  )
}

function validTo(days?: z.infer<typeof ExpirationTypeSchema> | undefined) {
  if (!days || days === 0) return 'End of time.'
  return dayjs().add(days, 'seconds').format('DD/MM/YYYY')
}

function parseToSeconds(value: string, unit: TimeUnit) {
  switch (unit) {
    case 'day':
      return Number(value) * 24 * 60 * 60 // Each day has 24hs and each hour has 60 min, each min has 60 seconds
    case 'month':
      return Number(value) * 30 * 24 * 60 * 60 // Each month has 30 days as default
    case 'year':
      return Number(value) * 360 * 24 * 60 * 60 // Each year has 360 days as default
  }
}
