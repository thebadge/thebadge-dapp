import React, { PropsWithChildren, useEffect, useRef } from 'react'

import { Box, Stack } from '@mui/material'
import { useInViewport } from 'react-in-viewport'

import { Loading } from '@/src/components/loading/Loading'
import { SpinnerProps } from '@/src/components/loading/Spinner'

type Props = {
  children: React.ReactNode
  fallback?: JSX.Element
  minHeight?: number
  minWidth?: number
  onViewPortEnter?: VoidFunction
}
export default function InViewPort({
  children,
  color,
  minHeight,
  minWidth,
  onViewPortEnter,
  fallback = <Loading color={color} />,
}: PropsWithChildren<Props & SpinnerProps>) {
  const elemRef = useRef<HTMLDivElement>(null)
  const { enterCount, inViewport } = useInViewport(elemRef)

  useEffect(() => {
    if (enterCount > 0 && onViewPortEnter) {
      // Trigger any functionality needed when the element go to the viewPort
      onViewPortEnter()
    }
  }, [enterCount, onViewPortEnter])

  // If it has been rendered, the query was made, so we can safely render it
  // since the network call was already made
  const shouldDisplay = enterCount > 0 || inViewport
  if (shouldDisplay) return children
  if (!minHeight && !minWidth) {
    return <Box ref={elemRef}>{fallback}</Box>
  }
  return (
    <Stack minHeight={minHeight} minWidth={minWidth} position="relative" ref={elemRef}>
      {fallback}
    </Stack>
  )
}
