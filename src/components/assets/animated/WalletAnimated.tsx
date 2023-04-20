import React from 'react'

import { Theme, styled } from '@mui/material'
import { MUIStyledCommonProps } from '@mui/system'

import { useLottieAnimation } from '@/src/hooks/useLottieAnimation'

const AnimationContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  width: '300px',
  height: '300px',
}))

export const WalletAnimated = (props: MUIStyledCommonProps<Theme>) => {
  const ref = useLottieAnimation('wallet.json')

  return (
    <AnimationContainer {...props}>
      <div ref={ref} />
    </AnimationContainer>
  )
}
