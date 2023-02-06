import { SyntheticEvent, useState } from 'react'

import StarIcon from '@mui/icons-material/Star'
import { Box, Rating } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { Severity, Severity_Keys } from '@/types/utils'

export default function RatingSelector() {
  const { error, field } = useTsController<z.infer<typeof SeverityTypeSchema>>()
  const { label } = useDescription()
  const [value, setValue] = useState<number>(1)
  const [hover, setHover] = useState(-1)

  const handleChange = (e: SyntheticEvent, newValue: number | null) => {
    if (newValue) {
      setValue(newValue)
      field.onChange(Severity[newValue])
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
      label={label}
      labelPosition={'top'}
      status={error ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error?.errorMessage}
    />
  )
}
