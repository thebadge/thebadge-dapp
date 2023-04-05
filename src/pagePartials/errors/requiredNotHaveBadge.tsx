import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useIsBadgeOwner from '@/src/hooks/useIsBadgeOwner'
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
  const router = useRouter()
  const { address } = useWeb3Connection()

  const badgeTypeId = router.query.typeId as string
  const isBadgeOwner = useIsBadgeOwner(badgeTypeId, address as string)

  if (isBadgeOwner.data) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <AlreadyOwnThisBadgeError />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}
