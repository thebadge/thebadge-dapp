import { Box, styled } from '@mui/material'

import { TextFieldStatus } from '@/src/components/form/TextField'

export const FormStatus = styled(Box)<{ status?: TextFieldStatus }>`
  color: ${({ status, theme: { palette } }) =>
    status === TextFieldStatus.error
      ? palette.error.main
      : status === TextFieldStatus.success
      ? palette.success.main
      : palette.text.primary};
  display: block;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;

  &:empty {
    display: none;
  }
`
