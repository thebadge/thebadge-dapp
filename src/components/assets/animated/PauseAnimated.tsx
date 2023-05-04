import React from 'react'

import { Theme, styled } from '@mui/material'
import { MUIStyledCommonProps } from '@mui/system'

import { useLottieAnimation } from '@/src/hooks/useLottieAnimation'

const AnimationContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  width: '150px',
  height: '150px',
}))

export const PauseAnimated = (props: MUIStyledCommonProps<Theme>) => {
  const ref = useLottieAnimation('time.json')

  return (
    <AnimationContainer {...props}>
      <div ref={ref} />
    </AnimationContainer>
  )
}
