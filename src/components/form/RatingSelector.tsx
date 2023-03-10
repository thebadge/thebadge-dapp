import * as React from 'react'
import { SyntheticEvent, useState } from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import StarIcon from '@mui/icons-material/Star'
import { Box, Rating, Tooltip, Typography } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'
import { Severity, Severity_Keys } from '@/types/utils'

type RatingSelectorProps = {
  error?: FieldError
  label?: string
  onChange: (value: any) => void
  placeholder?: string
  value: z.infer<typeof SeverityTypeSchema> | undefined
}

export function RatingSelector({ error, label, onChange, placeholder }: RatingSelectorProps) {
  const [value, setValue] = useState<number>(1)
  const [hover, setHover] = useState(-1)

  const handleChange = (e: SyntheticEvent, newValue: number | null) => {
    if (newValue) {
      setValue(newValue)
      onChange(Severity[newValue])
    }
  }

  function valuetext(value: number) {
    return Severity_Keys[value - 1]
  }

  return (
    <FormField
      formControl={
        <Box>
          <Rating
            emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.55 }} />}
            max={3}
            name="court-severity"
            onChange={handleChange}
            onChangeActive={(event, newHover) => {
              setHover(newHover)
            }}
            precision={1}
            size="large"
            value={value}
          />
          <Box sx={{ ml: 2 }}>{valuetext(hover !== -1 ? hover : value)}</Box>
        </Box>
      }
      label={
        <Typography>
          {label}
          {placeholder && (
            <Tooltip title={placeholder}>
              <InfoOutlinedIcon sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Typography>
      }
      labelPosition={'top'}
      status={error ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error?.message}
    />
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function RatingSelectorWithTSForm() {
  const { error, field } = useTsController<z.infer<typeof SeverityTypeSchema>>()
  const { label, placeholder } = useDescription()

  function onChange(value: any) {
    field.onChange(value)
  }

  return (
    <RatingSelector
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={field.value}
    />
  )
}
