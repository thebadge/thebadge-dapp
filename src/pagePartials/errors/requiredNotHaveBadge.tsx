import React, { ReactElement, useState } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useIsBadgeOwner from '@/src/hooks/subgraph/useIsBadgeOwner'
import AlreadyOwnThisBadgeError from '@/src/pagePartials/errors/displays/AlreadyOwnThisBadgeError'
import { ChainsValues } from '@/types/chains'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

type RequiredConnectionProps = {
  children: ReactElement
  minHeight?: number
  networkToCheck?: ChainsValues
  ownerAddress: string | null
}

export const RequiredNotHaveBadge: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  ownerAddress,
  ...restProps
}) => {
  const [wantToContinue, setWantToContinue] = useState(false)
  const badgeModelId = useModelIdParam()
  const isBadgeOwner = useIsBadgeOwner(badgeModelId, ownerAddress)

  if (!wantToContinue && isBadgeOwner) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <AlreadyOwnThisBadgeError onClose={() => setWantToContinue(true)} />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}
