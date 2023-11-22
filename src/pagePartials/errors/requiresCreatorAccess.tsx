import React, { ReactElement } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useIsRegistered from '@/src/hooks/subgraph/useIsRegistered'
import NotRegisteredError from '@/src/pagePartials/errors/displays/NotRegisteredError'
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

export const RegistrationRequired: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  ...restProps
}) => {
  const { data: isRegistered } = useIsRegistered()
  return (
    <>
      {isRegistered ? (
        <SafeSuspense>{children}</SafeSuspense>
      ) : (
        <Wrapper style={{ minHeight }} {...restProps}>
          <NotRegisteredError />
        </Wrapper>
      )}
    </>
  )
}
