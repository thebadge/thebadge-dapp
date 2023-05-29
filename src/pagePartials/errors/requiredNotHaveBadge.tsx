import React, { ReactElement, useState } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useIsBadgeOwner from '@/src/hooks/subgraph/useIsBadgeOwner'
import AlreadyOwnThisBadgeError from '@/src/pagePartials/errors/displays/AlreadyOwnThisBadgeError'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
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
}

export const RequiredNotHaveBadge: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  ...restProps
}) => {
  const { address } = useWeb3Connection()
  const [wantToContinue, setWantToContinue] = useState(false)
  const badgeModelId = useModelIdParam()
  const isBadgeOwner = useIsBadgeOwner(badgeModelId, address)

  if (!wantToContinue && isBadgeOwner) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <AlreadyOwnThisBadgeError onClose={() => setWantToContinue(true)} />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}
