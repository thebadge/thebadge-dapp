'use client'

import React, { useState } from 'react'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@mui/styles'

type ChildProps = { children: React.ReactNode }

/**
 * Temporal solution, until Emotion add official support for Next13
 * https://github.com/emotion-js/emotion/issues/2928
 */
export function useStyledComponentsRegistry() {
  const materialUiSheets = new MaterialUiServerStyleSheets()

  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'css', prepend: true })
    cache.compat = true

    const prevInsert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }

    const flush = () => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }

    return { cache, flush }
  })

  const styledComponentsFlushEffect = () => {
    const names = flush()
    if (names.length === 0) return null
    let styles = ''

    for (const name of names) {
      styles += cache.inserted[name]
    }

    styles += materialUiSheets.getStyleElement()

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
        data-emotion={`${cache.key} ${names.join(' ')}`}
      />
    )
  }

  function StyledComponentsRegistry({ children }: ChildProps) {
    return <CacheProvider value={cache}>{children as React.ReactNode}</CacheProvider>
  }

  return [StyledComponentsRegistry, styledComponentsFlushEffect] as const
}
