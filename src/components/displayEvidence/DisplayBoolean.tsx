import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Checkbox as MUICheckbox, Tooltip, Typography } from '@mui/material'

import { FormField } from '@/src/components/form/helpers/FormField'

type DisplayBooleanProps = {
  label?: string
  placeholder?: string
  value: boolean | undefined
}

export function DisplayBoolean({ label, placeholder, value }: DisplayBooleanProps) {
  return (
    <FormField
      formControl={
        <MUICheckbox
          checked={!!value}
          contentEditable={false}
          disabled
          sx={{ width: 'fit-content' }}
        />
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
      labelPosition={'left'}
    />
  )
}
