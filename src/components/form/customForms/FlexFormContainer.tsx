import { Box, styled } from '@mui/material'

const FlexFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center',
  gap: theme.spacing(2),
  alignItems: 'flex-end',
  margin: theme.spacing(2, 0),
  '& > *': {
    display: 'flex',
    flex: '1 1 40%',
  },
}))

export default FlexFormContainer
