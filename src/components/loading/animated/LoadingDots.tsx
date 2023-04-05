import { Box, keyframes, styled } from '@mui/material'

const Wrapper = styled(Box)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem;
  height: 65px;
  width: 65px;
  border: 4px solid #fff;
  border-radius: 50%;
`

const shadowPulse = keyframes`
  33% {
    background: #FFF;
    box-shadow: -16px 0 #62CBA5, 16px 0 #FFF;
  }
  66% {
    background: #62CBA5;
    box-shadow: -16px 0 #FFF, 16px 0 #FFF;
  }
  100% {
    background: #FFF;
    box-shadow: -16px 0 #FFF, 16px 0 #62CBA5;
  }
`
const Loader = styled('span')(() => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  display: 'block',
  margin: 'auto',
  position: 'relative',
  background: '#FFF',
  boxShadow: '-16px 0 #FFF, 16px 0 #FFF',
  animation: `${shadowPulse} 2s linear infinite`,
}))

export const LoadingDots = () => {
  return (
    <Wrapper>
      <Loader />
    </Wrapper>
  )
}
