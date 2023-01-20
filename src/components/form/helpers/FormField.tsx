import React, { cloneElement, useMemo } from 'react'

import { Box, styled } from '@mui/material'

import { TextFieldStatus } from '../TextField'
import { FormStatus } from './FormStatus'
import { Label } from './Label'

const StyledBox = styled(Box)<{ status?: TextFieldStatus }>(() => ({}))

export const FormField: React.FC<{
  formControl: React.ReactElement
  label?: string
  status?: TextFieldStatus | undefined
  statusText?: string | undefined
}> = ({ formControl, label, status, statusText, ...restProps }) => {
  const control = useMemo(
    () =>
      cloneElement(formControl, {
        status: status,
      }),
    [status, formControl],
  )

  return (
    <StyledBox status={status} {...restProps}>
      {label && <Label>{label}</Label>}
      {control}
      {statusText && <FormStatus status={status}>{statusText}</FormStatus>}
    </StyledBox>
  )
}
