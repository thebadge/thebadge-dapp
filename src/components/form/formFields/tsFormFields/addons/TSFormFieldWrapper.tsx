import { Stack, styled } from '@mui/material'

export const TSFormFieldWrapper = styled(Stack)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  flexDirection: 'row',
  rowGap: theme.spacing(0.5),
}))
