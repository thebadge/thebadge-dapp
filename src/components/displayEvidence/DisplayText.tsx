import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, TextField as MUITextField, Tooltip, styled } from '@mui/material'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
}))

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(0),
}))

type DisplayTextProps = {
  label?: string
  placeholder?: string
  value: string | undefined
}

export function DisplayText({ label, placeholder, value }: DisplayTextProps) {
  return (
    <Wrapper>
      <StyledTextField
        InputProps={{
          endAdornment: (
            <Tooltip arrow title={placeholder}>
              <InfoOutlinedIcon />
            </Tooltip>
          ),
        }}
        color="secondary"
        contentEditable={false}
        label={label}
        sx={{ width: '100%', textTransform: 'capitalize' }}
        value={value ? value : ''}
        variant={'standard'}
      />
    </Wrapper>
  )
}
