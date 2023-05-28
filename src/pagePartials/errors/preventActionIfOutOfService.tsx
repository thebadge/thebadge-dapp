import React, { ReactElement } from 'react'

import { styled } from '@mui/material'

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
  minHeight?: number
}

const CheckStatus: React.FC<Props> = ({ children }) => {
  const subGraphAvailable = useSubGraphStatus()

  if (
    !subGraphAvailable.data ||
    subGraphAvailable.data?.hasIndexingErrors ||
    subGraphAvailable.error
  ) {
    console.log(subGraphAvailable.error)
    return (
      <Wrapper sx={{ minHeight: '70vh' }}>
        <OutOfService errorCode={'ER-SG-404'} />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}

export const PreventActionIfOutOfService: React.FC<Props> = ({ children }) => {
  return (
    <SafeSuspense>
      <CheckStatus>{children}</CheckStatus>
    </SafeSuspense>
  )
}
