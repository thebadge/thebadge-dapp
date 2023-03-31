import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Tooltip, Typography } from '@mui/material'

import { FormField } from '@/src/components/form/helpers/FormField'

type DisplayLinkProps = {
  label?: string
  placeholder?: string
  value: string
}

const protocolRegex = /:\/\//

export function DisplayLink({ label, placeholder, value }: DisplayLinkProps) {
  return (
    <FormField
      formControl={
        <Typography
          component={'a'}
          href={protocolRegex.test(value) ? value : `https://${value}`}
          target={'_blank'}
        >
          {value}
        </Typography>
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
    />
  )
}
