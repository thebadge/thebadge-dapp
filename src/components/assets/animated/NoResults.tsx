import React from 'react'

import { Theme, Typography, styled } from '@mui/material'
import { MUIStyledCommonProps } from '@mui/system'

import { useLottieAnimation } from '@/src/hooks/useLottieAnimation'

const AnimationContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  width: '300px',
  height: '300px',
}))

export const NoResultsAnimated = (props: MUIStyledCommonProps<Theme> & { errorText?: string }) => {
  const ref = useLottieAnimation('no-results.json')

  return (
    <AnimationContainer>
      <Typography variant="body3">{props.errorText}</Typography>
      <div ref={ref} />
    </AnimationContainer>
  )
}
