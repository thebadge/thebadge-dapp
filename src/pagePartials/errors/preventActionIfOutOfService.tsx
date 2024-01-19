import React, { ReactElement } from 'react'

import { Container, Skeleton, Stack, styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useSubGraphStatus from '@/src/hooks/subgraph/useSubGraphStatus'
import OutOfService from '@/src/pagePartials/errors/displays/OutOfService'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

type Props = {
  children: ReactElement
  fallback?: ReactElement
  minHeight?: number
}

const CheckStatus: React.FC<Props> = ({
  children,
  fallback = (
    <Stack justifyContent="center">
      <Skeleton height={28} variant="rounded" width={100} />
    </Stack>
  ),
}) => {
  const { data, error, isLoading } = useSubGraphStatus()

  if (isLoading) return null
  if (!data || data?.hasIndexingErrors || error) {
    return fallback
  }

  return <SafeSuspense>{children}</SafeSuspense>
}

export const PreventPageIfOutOfService: React.FC<Props> = ({ children }) => {
  return (
    <SafeSuspense>
      <CheckStatus
        fallback={
          <Container>
            <Wrapper sx={{ minHeight: '70vh' }}>
              <OutOfService errorCode={'ER-SG-404'} />
            </Wrapper>
          </Container>
        }
      >
        {children}
      </CheckStatus>
    </SafeSuspense>
  )
}

export const PreventActionIfOutOfService: React.FC<Props> = ({ children }) => {
  return (
    <SafeSuspense
      fallback={
        <Stack justifyContent="center">
          <Skeleton height={28} variant="rounded" width={100} />
        </Stack>
      }
    >
      <CheckStatus>{children}</CheckStatus>
    </SafeSuspense>
  )
}
