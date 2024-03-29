import React, { ReactElement } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import ActionIsPaused from '@/src/pagePartials/errors/displays/ActionIsPaused'

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

export const PreventActionIfBadgeModelPaused: React.FC<Props> = ({ children, minHeight }) => {
  const { badgeModelId, contract } = useModelIdParam()
  const { data } = useBadgeModel(badgeModelId, contract)

  if (data?.badgeModel.paused) {
    return (
      <Wrapper style={{ minHeight }}>
        <ActionIsPaused />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}

export const PreventActionIfRegisterPaused: React.FC<Props> = ({ children, minHeight }) => {
  const isRegisterPaused = false
  if (isRegisterPaused) {
    return (
      <Wrapper style={{ minHeight }}>
        <ActionIsPaused />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}
