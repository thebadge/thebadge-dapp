import { Stack, styled } from '@mui/material'

export const TSFormField = styled(Stack)(({ theme }) => ({
  position: 'relative',
  width: '70%',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  padding: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(0.5, 0, 1.5, 0),
  },
}))
