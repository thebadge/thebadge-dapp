import { Stack, styled } from '@mui/material'

export const TSFormField = styled(Stack)(({ theme }) => ({
  position: 'relative',
  width: '70%',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  padding: theme.spacing(1.5),
}))
