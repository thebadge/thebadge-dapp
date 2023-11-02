import React, { PropsWithChildren, useRef } from 'react'

import { Stack } from '@mui/material'
import { useInViewport } from 'react-in-viewport'

import { Loading } from '@/src/components/loading/Loading'
import { SpinnerProps } from '@/src/components/loading/Spinner'

type Props = {
  children: React.ReactNode
  fallback?: JSX.Element
  minHeight?: number
  minWidth?: number
}
export default function InViewPort({
  children,
  color,
  minHeight,
  minWidth,
  fallback = <Loading color={color} />,
}: PropsWithChildren<Props & SpinnerProps>) {
  const elemRef = useRef<HTMLDivElement>(null)
  const { enterCount, inViewport } = useInViewport(elemRef)

  // If it has been rendered, the query was made, so we can safely render it
  // since the network call was already made
  const shouldDisplay = enterCount > 0 || inViewport
  return (
    <Stack minHeight={minHeight} minWidth={minWidth} position="relative" ref={elemRef}>
      {shouldDisplay ? children : fallback}
    </Stack>
  )
}
