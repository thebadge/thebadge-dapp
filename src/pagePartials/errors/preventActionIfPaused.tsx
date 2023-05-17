import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import ActionIsPaused from '@/src/pagePartials/errors/displays/AcctionIsPaused'

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

export const PreventActionIfBadgeTypePaused: React.FC<Props> = ({ children, minHeight }) => {
  const router = useRouter()

  const badgeTypeId = router.query.typeId as string
  const badgeType = useBadgeModel(badgeTypeId)

  if (badgeType.data?.badgeModel.paused) {
    return (
      <Wrapper style={{ minHeight }}>
        <ActionIsPaused />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}

export const PreventActionIfRegisterPaused: React.FC<Props> = ({ children, minHeight }) => {
  // TODO, Need to check with Nico where is this flag, maybe is coming with the next SC update
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
