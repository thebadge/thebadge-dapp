import { Box, styled } from '@mui/material'
import { gradients } from 'thebadge-ui-library'

const Background = styled(Box)({
  background: gradients.gradientBackground,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '100%',
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  /* z-index usage is up to you.. although there is no need of using it because the default stack context will work. */
  zIndex: -1, // this is optional
})
export const BackgroundGradient = () => {
  return <Background />
}
