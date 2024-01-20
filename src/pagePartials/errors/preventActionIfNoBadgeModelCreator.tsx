import React, { ReactElement } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import NotTheBadgeModelCreatorError from '@/src/pagePartials/errors/displays/NotTheBadgeModelCreatorError'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import isSameAddress from '@/src/utils/addressValidations'

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

export const PreventActionIfNoBadgeModelCreator: React.FC<Props> = ({ children, minHeight }) => {
  const { badgeModelId, contract } = useModelIdParam()
  const badgeModel = useBadgeModel(badgeModelId, contract)
  const { address } = useWeb3Connection()

  if (
    !address ||
    !badgeModel.data ||
    !isSameAddress(address, badgeModel.data.badgeModel.creator.id)
  ) {
    return (
      <Wrapper style={{ minHeight }}>
        <NotTheBadgeModelCreatorError />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}
