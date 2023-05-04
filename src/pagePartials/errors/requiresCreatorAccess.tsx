import React, { ReactElement } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useIsCreator from '@/src/hooks/subgraph/useIsCreator'
import NotACreatorError from '@/src/pagePartials/errors/displays/NotACreatorError'
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

export const RequiredCreatorAccess: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  ...restProps
}) => {
  const { data: isCreator } = useIsCreator()
  return (
    <>
      {isCreator ? (
        <SafeSuspense>{children}</SafeSuspense>
      ) : (
        <Wrapper style={{ minHeight }} {...restProps}>
          <NotACreatorError />
        </Wrapper>
      )}
    </>
  )
}
