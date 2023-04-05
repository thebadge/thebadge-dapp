import React, { useEffect, useRef, useState } from 'react'

import { Typography, styled } from '@mui/material'
import type { LottiePlayer } from 'lottie-web'

const AnimationContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  width: '300px',
  height: '300px',
}))

export const BadgeAnimatedLogo = (props: { errorText?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [lottie, setLottie] = useState<LottiePlayer | null>(null)

  useEffect(() => {
    import('lottie-web').then((Lottie) => setLottie(Lottie.default))
  }, [])

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/lottie-files/tb-logo.json',
      })

      return () => animation.destroy()
    }
  }, [lottie])

  return (
    <AnimationContainer>
      <Typography variant="body3">{props.errorText}</Typography>
      <div ref={ref} />
    </AnimationContainer>
  )
}
