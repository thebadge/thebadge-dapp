import * as React from 'react'

import { Box, TextField as MUITextField, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',

  flex: 1,
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
}))

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(1),
}))

export default function TextField() {
  const { error, field } = useTsController<string>()
  const { label } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  return (
    <Wrapper>
      <StyledTextField
        color="secondary"
        error={!!error}
        helperText={error?.errorMessage || ' '}
        label={label}
        onChange={onChange}
        value={field.value ? field.value : ''}
        variant={'standard'}
      />
    </Wrapper>
  )
}
