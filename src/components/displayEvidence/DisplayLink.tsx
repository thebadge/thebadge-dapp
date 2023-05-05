import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Divider, Tooltip, Typography, styled } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { FormField } from '@/src/components/form/helpers/FormField'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}))

type DisplayLinkProps = {
  label?: string
  placeholder?: string
  value: string
}

const protocolRegex = /:\/\//

export function DisplayLink({ label, placeholder, value }: DisplayLinkProps) {
  return (
    <Wrapper>
      <FormField
        formControl={
          <Typography
            component={'a'}
            href={protocolRegex.test(value) ? value : `https://${value}`}
            sx={{
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              overflowWrap: 'anywhere',
              wordBreak: 'break-all',
              width: '100%',
              display: 'flex',
            }}
            target={'_blank'}
          >
            {value ? value : 'Undefined value'}
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Typography>
        }
        label={<Typography>{label}</Typography>}
        labelPosition={'top-left'}
      />
      <Divider color={colors.white} sx={{ mt: -1 }} />
    </Wrapper>
  )
}
