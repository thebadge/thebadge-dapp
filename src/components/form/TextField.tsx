import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, TextField as MUITextField, Tooltip, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
}))

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(0),
}))

export default function TextField() {
  const { error, field } = useTsController<string>()
  const { label, placeholder } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  return (
    <Wrapper>
      <StyledTextField
        InputProps={{
          endAdornment: (
            <Tooltip title={placeholder}>
              <InfoOutlinedIcon />
            </Tooltip>
          ),
        }}
        color="secondary"
        error={!!error}
        helperText={error?.errorMessage || ' '}
        label={label}
        onChange={onChange}
        sx={{ textTransform: 'capitalize' }}
        value={field.value ? field.value : ''}
        variant={'standard'}
      />
    </Wrapper>
  )
}
