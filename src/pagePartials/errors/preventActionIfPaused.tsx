import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeType from '@/src/hooks/subgraph/useBadgeType'
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
  const badgeType = useBadgeType(badgeTypeId)

  if (badgeType.data?.badgeType.paused) {
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
