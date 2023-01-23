import React, { cloneElement, useMemo } from 'react'

import { Box, styled } from '@mui/material'

import { TextFieldStatus } from '../TextField'
import { FormStatus } from './FormStatus'
import { Label } from './Label'

const StyledBox = styled(Box)<{ status?: TextFieldStatus }>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  margin: theme.spacing(1),
}))

export const FormField: React.FC<{
  formControl: React.ReactElement
  label?: string
  labelPosition?: 'top' | 'left'
  status?: TextFieldStatus | undefined
  statusText?: string | undefined
}> = ({ formControl, label, labelPosition = 'top', status, statusText, ...restProps }) => {
  const control = useMemo(
    () =>
      cloneElement(formControl, {
        status: status,
      }),
    [status, formControl],
  )

  return (
    <StyledBox status={status} {...restProps}>
      <Box sx={{ display: 'flex', flexDirection: labelPosition === 'top' ? 'column' : 'row' }}>
        {label && <Label>{label}</Label>}
        {control}
      </Box>
      {statusText && <FormStatus status={status}>{statusText}</FormStatus>}
    </StyledBox>
  )
}
