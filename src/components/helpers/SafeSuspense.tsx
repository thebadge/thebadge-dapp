import React, { FC, PropsWithChildren, Suspense, useCallback } from 'react'

import { Box } from '@mui/material'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import { GeneralError, GeneralPageError } from '@/src/components/helpers/GeneralError'
import { Loading } from '@/src/components/loading/Loading'
import { SpinnerProps } from '@/src/components/loading/Spinner'
import { IS_DEVELOP } from '@/src/constants/common'
import { NextPageWithLayout } from '@/types/next'
import { IntrinsicElements } from '@/types/utils'

type Props = {
  children: React.ReactNode
  fallback?: JSX.Element
  onErrorFallback?: (props: FallbackProps) => React.ReactElement
}

const DefaultFallback: React.FC<SpinnerProps> = ({ color }: SpinnerProps) => {
  return <Loading color={color} />
}

const DefaultPageFallback: React.FC<SpinnerProps> = ({ color }: SpinnerProps) => {
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
  onErrorFallback,
}: PropsWithChildren<Props & SpinnerProps>): JSX.Element {
  const defaultErrorRendered = useCallback(
    ({ error, resetErrorBoundary }: FallbackProps) => (
      <GeneralError error={error} resetErrorBoundary={resetErrorBoundary} />
    ),
    [],
  )

  return (
    <ErrorBoundary
      fallbackRender={onErrorFallback || defaultErrorRendered}
      onError={(error, info) => IS_DEVELOP && console.error(error, info)}
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
      onError={(error, info) => IS_DEVELOP && console.error(error, info)}
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
