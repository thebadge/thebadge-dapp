import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Divider, Tooltip, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'

import { FormField } from '@/src/components/form/helpers/FormField'
import { Address } from '@/src/components/helpers/Address'

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}))

type DisplayAddressProps = {
  label?: string
  placeholder?: string
  value: `0x${string}`
}

export function DisplayAddress({ label, placeholder, value }: DisplayAddressProps) {
  return (
    <Wrapper>
      <FormField
        formControl={
          <Box display="flex" justifyContent="space-between" width="100%">
            <Address address={value} />
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Box>
        }
        label={<Typography variant="subtitle2">{label}</Typography>}
        labelPosition={'top-left'}
      />
      <Divider color={colors.white} sx={{ mt: -1 }} />
    </Wrapper>
  )
}
