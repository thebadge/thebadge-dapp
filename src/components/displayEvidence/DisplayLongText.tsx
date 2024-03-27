'use client'

import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Divider, Tooltip, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'

import { FormField } from '@/src/components/form/helpers/FormField'

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  gridColumn: 'auto',
}))

type DisplayLongTextProps = {
  label?: string
  placeholder?: string
  value: string | undefined
}
export function DisplayLongText({ label, placeholder, value }: DisplayLongTextProps) {
  return (
    <Wrapper>
      <FormField
        formControl={
          <Typography
            sx={{
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              overflowWrap: 'anywhere',
              wordBreak: 'break-all',
              width: '100%',
              display: 'flex',
            }}
          >
            {value ? value : 'Undefined value'}
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Typography>
        }
        label={<Typography variant="subtitle2">{label}</Typography>}
        labelPosition={'top-left'}
      />
      <Divider color={colors.white} sx={{ mt: -1 }} />
    </Wrapper>
  )
}
