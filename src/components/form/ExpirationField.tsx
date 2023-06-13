import { ChangeEvent, useEffect, useState } from 'react'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Box,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  styled,
} from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import dayjs from 'dayjs'
import { FieldError } from 'react-hook-form'
import { z } from 'zod'

import { ExpirationTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'
import { Disable } from '@/src/components/helpers/DisableElements'

type TimeUnit = 'day' | 'month' | 'year'
const options = ['day', 'month', 'year']

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  position: 'relative',
}))

const InputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
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
  }, [onChange])

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

  function handleDropdownChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newUnit = e.target.value as TimeUnit
    setUnit(newUnit)
    onChange(parseToSeconds(stringValue, newUnit))
  }

  function toggleExpiration(enable: boolean) {
    setEnableExpiration(enable)
    if (!enable) {
      onChange(0) // if disable expiration, reset the values
      setExpiration('')
      setUnit('day')
    }
  }

  return (
    <Wrapper>
      <Stack flex="1" gap={0} justifyContent="center">
        <Box alignItems="center" display="flex">
          <FormControlLabel
            control={
              <Switch
                checked={enableExpiration}
                onChange={() => toggleExpiration(!enableExpiration)}
              />
            }
            label={'Enable expiration time'}
          />
        </Box>

        <Disable disabled={!enableExpiration}>
          <InputWrapper>
            <TextField
              InputProps={{
                endAdornment: (
                  <Tooltip
                    arrow
                    title={
                      placeholder +
                      `\n e.g. If you mint this badge today, It will expire on: ${validTo(value)}`
                    }
                  >
                    <InfoOutlinedIcon />
                  </Tooltip>
                ),
              }}
              color="secondary"
              label={label}
              onChange={handleOnChange}
              sx={{ justifyContent: 'end', textTransform: 'capitalize' }}
              value={stringValue}
              variant={'standard'}
            />
            <TextField
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      p: 0.5,
                      '& .MuiMenuItem-root': {
                        px: 1,
                        borderRadius: 0.75,
                        typography: 'body2',
                        textTransform: 'capitalize',
                      },
                    },
                  },
                },
                sx: { textTransform: 'capitalize' },
              }}
              error={!!error}
              id="unit-select"
              onChange={handleDropdownChange}
              select
              size="small"
              sx={{
                textTransform: 'capitalize',
                ml: 2,
                mt: 'auto',
              }}
              value={unit || ''}
              variant="standard"
            >
              {options.map((op) => {
                return (
                  <MenuItem key={op} value={op}>
                    {op}s
                  </MenuItem>
                )
              })}
            </TextField>
          </InputWrapper>
        </Disable>
      </Stack>
    </Wrapper>
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
