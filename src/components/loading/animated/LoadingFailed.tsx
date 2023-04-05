import CloseIcon from '@mui/icons-material/Close'
import { Box, styled } from '@mui/material'

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

const Loader = styled('span')(() => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  display: 'block',
  margin: 'auto',
  position: 'relative',
  background: '#FFF',
  boxShadow: '-16px 0 #FFF, 16px 0 #FFF',
}))

export const LoadingFailed = () => {
  return (
    <Wrapper>
      <CloseIcon sx={{ marginBottom: '-10px', marginTop: '4px' }} />
      <Loader />
    </Wrapper>
  )
}
