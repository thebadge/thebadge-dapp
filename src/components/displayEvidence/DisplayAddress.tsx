import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Tooltip, Typography, styled } from '@mui/material'

import { FormField } from '@/src/components/form/helpers/FormField'
import { Address } from '@/src/components/helpers/Address'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
}))
type DisplayAddressProps = {
  label?: string
  placeholder?: string
  value: string
}

export function DisplayAddress({ label, placeholder, value }: DisplayAddressProps) {
  return (
    <Wrapper>
      <FormField
        formControl={<Address address={value} />}
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
    </Wrapper>
  )
}
