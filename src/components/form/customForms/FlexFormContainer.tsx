import { Box, styled } from '@mui/material'

const FlexFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'center',
  alignItems: 'flex-end',
  margin: theme.spacing(2, 0),
  '& > *': {
    display: 'flex',
    flex: '1 1 25%',
  },
}))

export default FlexFormContainer
