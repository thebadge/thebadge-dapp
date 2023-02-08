import React, { FC, PropsWithChildren, Suspense } from 'react'

import { Box } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'

import { GeneralError, GeneralPageError } from '@/src/components/helpers/GeneralError'
import { Loading } from '@/src/components/loading/Loading'
import isDev from '@/src/utils/isDev'
import { NextPageWithLayout } from '@/types/next'
import { IntrinsicElements } from '@/types/utils'

type Props = {
  children: React.ReactNode
  fallback?: JSX.Element
}

function DefaultFallback(): JSX.Element {
  return <Loading />
}

function DefaultPageFallback(): JSX.Element {
  return (
    <Box display="flex" height="50vh">
      <Loading />
    </Box>
  )
}

export default function SafeSuspense({
  children,
  fallback = <DefaultFallback />,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <GeneralError error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onError={(error, info) => isDev && console.error(error, info)}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export function withPageGenericSuspense<TProps>(Page: NextPageWithLayout, fallback?: FC<TProps>) {
  const displayName = Page.displayName || Page.name || 'Page'

  const PageWithGenericSuspense = (props: IntrinsicElements & TProps) => (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <GeneralPageError error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onError={(error, info) => isDev && console.error(error, info)}
    >
      <Suspense fallback={fallback ? fallback(props) : <DefaultPageFallback />}>
        <Page {...props} />
      </Suspense>
    </ErrorBoundary>
  )

  PageWithGenericSuspense.displayName = `withPageGenericSuspense(${displayName})`
  if (Page?.getLayout) PageWithGenericSuspense.getLayout = Page.getLayout

  return PageWithGenericSuspense
}
