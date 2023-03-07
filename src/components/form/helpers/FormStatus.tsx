import { styled } from '@mui/material'

import { TextFieldStatus } from '../TextField'

export const FormStatus = styled('p')<{ status?: TextFieldStatus }>`
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
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
  &:empty {
    display: none;
  }
`
