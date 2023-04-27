import React, { cloneElement, useMemo } from 'react'

import { Box, styled } from '@mui/material'

import { TextFieldStatus } from '../TextField'
import { FormStatus } from './FormStatus'
import { Label } from './Label'

const StyledBox = styled(Box)<{ status?: TextFieldStatus }>(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flexDirection: 'column',
  position: 'relative',
  height: '100%',
}))

export const FormField: React.FC<{
  formControl: React.ReactElement
  label?: React.ReactElement | string
  labelPosition?: 'top' | 'left' | 'top-left'
  status?: TextFieldStatus | undefined
  statusText?: string
}> = ({ formControl, label, labelPosition = 'top', status, statusText = ' ', ...restProps }) => {
  const control = useMemo(
    () =>
      cloneElement(formControl, {
        status: status,
      }),
    [status, formControl],
  )

  return (
    <StyledBox status={status} {...restProps}>
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          flexDirection: labelPosition.includes('top') ? 'column' : 'row',
          minWidth: '100%',
          maxWidth: '100%',
          justifyContent: 'center',
          alignItems: labelPosition.includes('left') ? 'flex-start' : 'center',
        }}
      >
        {label && <Label>{label}</Label>}
        {control}
      </Box>
      <FormStatus status={status}>{statusText}</FormStatus>
    </StyledBox>
  )
}
