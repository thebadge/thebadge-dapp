'use client'

import { useServerInsertedHTML } from 'next/navigation'
import React from 'react'

import { useStyledComponentsRegistry } from './Styling'

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [StyledComponentsRegistry, styledComponentsFlushEffect] = useStyledComponentsRegistry()

  useServerInsertedHTML(() => {
    return <>{styledComponentsFlushEffect()}</>
  })

  return <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
}
