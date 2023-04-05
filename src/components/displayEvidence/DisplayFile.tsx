import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Tooltip, Typography } from '@mui/material'

import { FormField } from '@/src/components/form/helpers/FormField'

type DisplayFileProps = {
  label?: string
  placeholder?: string
  value: string | undefined
}

export function DisplayFile({ label, placeholder, value }: DisplayFileProps) {
  return (
    <FormField
      formControl={
        <Typography component={'a'} href={value}>
          {value}
        </Typography>
      }
      label={
        <Typography>
          {label}
          {placeholder && (
            <Tooltip arrow title={placeholder}>
              <InfoOutlinedIcon sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Typography>
      }
      labelPosition={'top'}
    />
  )
}
