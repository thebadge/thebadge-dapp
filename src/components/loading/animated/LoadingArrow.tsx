import { keyframes, styled } from '@mui/material'

const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`
const Loader = styled('span')(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderWidth: '3px',
  borderStyle: 'dashed solid  solid dotted',
  borderColor: `${theme.palette.white.light} ${theme.palette.white.light} transparent ${theme.palette.white.light}`,
  borderRadius: '50%',
  display: 'inline-block',
  position: 'relative',
  boxSizing: 'border-box',
  animation: `${rotation} 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite`,
  '&::after': {
    content: '""',
    boxSizing: 'border-box',
    position: 'absolute',
    left: '20px',
    top: '31px',
    border: '10px solid transparent',
    borderRightColor: `${theme.palette.white.light}`,
    transform: 'rotate(-40deg)',
  },
}))

export const LoadingArrow = () => {
  return <Loader />
}
