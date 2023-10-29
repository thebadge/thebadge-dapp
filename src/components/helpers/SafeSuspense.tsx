'use client'
import React, { FC, PropsWithChildren, Suspense } from 'react'

import { Box } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'

import { GeneralError, GeneralPageError } from '@/src/components/helpers/GeneralError'
import { Loading } from '@/src/components/loading/Loading'
import { SpinnerProps } from '@/src/components/loading/Spinner'
import isDev from '@/src/utils/isDev'
import { NextPageWithLayout } from '@/types/next'
import { IntrinsicElements } from '@/types/utils'

type Props = {
  children: React.ReactNode
  fallback?: JSX.Element
}

const DefaultFallback: React.FC<SpinnerProps> = ({ color }: SpinnerProps) => {
  return <Loading color={color} />
}

export const DefaultPageFallback: React.FC<SpinnerProps> = ({ color }: SpinnerProps) => {
  return (
    <Box display="flex" height="50vh">
      <Loading color={color} />
    </Box>
  )
}

export default function SafeSuspense({
  children,
  color,
  fallback = <DefaultFallback color={color} />,
}: PropsWithChildren<Props & SpinnerProps>): JSX.Element {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <GeneralError error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onError={(error, info) => isDev && console.error(error, info)}
      resetKeys={[children]}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export function withPageGenericSuspense<TProps>(
  Page: NextPageWithLayout,
  options?: {
    fallback?: FC<TProps>
    spinner?: SpinnerProps
  },
) {
  const displayName = Page.displayName || Page.name || 'Page'

  const PageWithGenericSuspense = (props: IntrinsicElements & TProps) => (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <GeneralPageError error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onError={(error, info) => isDev && console.error(error, info)}
      resetKeys={[Page]}
    >
      <Suspense
        fallback={
          options?.fallback ? (
            options.fallback(props)
          ) : (
            <DefaultPageFallback color={options?.spinner?.color} />
          )
        }
      >
        <Page {...props} />
      </Suspense>
    </ErrorBoundary>
  )

  PageWithGenericSuspense.displayName = `withPageGenericSuspense(${displayName})`
  if (Page?.getLayout) PageWithGenericSuspense.getLayout = Page.getLayout

  return PageWithGenericSuspense
}
