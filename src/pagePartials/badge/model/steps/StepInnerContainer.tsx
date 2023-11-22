import { Stack, styled } from '@mui/material'

const StepInnerContainer = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
}))

export default StepInnerContainer
