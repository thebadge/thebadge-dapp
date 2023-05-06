import React, { PropsWithChildren, useRef } from 'react'

import { Stack } from '@mui/material'
import { useInViewport } from 'react-in-viewport'

import { Loading } from '@/src/components/loading/Loading'
import { SpinnerProps } from '@/src/components/loading/Spinner'

type Props = {
  children: React.ReactNode
  fallback?: JSX.Element
  minHeight?: number
}
export default function InViewPort({
  children,
  color,
  minHeight,
  fallback = <Loading color={color} />,
}: PropsWithChildren<Props & SpinnerProps>) {
  const elemRef = useRef<HTMLDivElement>(null)
  const { inViewport } = useInViewport(elemRef)

  return (
    <Stack minHeight={minHeight} ref={elemRef}>
      {inViewport ? children : fallback}
    </Stack>
  )
}
