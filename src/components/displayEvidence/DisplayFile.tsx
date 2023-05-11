import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { Box, Divider, IconButton, Tooltip, Typography, styled } from '@mui/material'
import { colors } from 'thebadge-ui-library'

const Wrapper = styled(Box)(() => ({
  gap: 1,
  display: 'flex',
  flexDirection: 'row',
  minWidth: '100%',
  maxWidth: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

type DisplayFileProps = {
  label?: string
  placeholder?: string
  value: { data_url: string }
}

export function DisplayFile({ label, placeholder, value }: DisplayFileProps) {
  console.log(value)
  return (
    <>
      <Wrapper>
        <Typography>
          {label}
          {placeholder && (
            <Tooltip arrow title={placeholder}>
              <InfoOutlinedIcon sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Typography>
        <IconButton onClick={() => window.open(`${value.data_url}`, '_ blank')}>
          <OpenInNewOutlinedIcon />
        </IconButton>
      </Wrapper>
      <Divider color={colors.white} />
    </>
  )
}
