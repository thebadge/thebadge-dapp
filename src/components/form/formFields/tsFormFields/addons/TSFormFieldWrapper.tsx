import { Stack, styled } from '@mui/material'

export const TSFormFieldWrapper = styled(Stack)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  rowGap: theme.spacing(0.5),
}))
