import React, { ReactElement, ReactNode } from 'react'

import { styled } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/system'

import { DisableOverlay, DisableWrapper } from '@/src/components/helpers/DisableElements'
import useIsCreator from '@/src/hooks/subgraph/useIsCreator'
import ConnectWalletActionError from '@/src/pagePartials/errors/displays/ConnectWalletActionError'
import { RequiredCreatorAccess } from '@/src/pagePartials/errors/requiresCreatorAccess'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

type RequiredConnectionProps = {
  children: ReactElement | ReactNode
  minHeight?: number
  onlyCreator?: boolean
  sx?: SxProps<Theme>
}

const PreventActionWithoutConnection: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  onlyCreator,
  ...restProps
}) => {
  const { address, isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const { data: isCreator } = useIsCreator()
  const isConnected = isWalletConnected && address

  if (!isConnected) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <ConnectWalletActionError />
        <DisableWrapper onClick={(e) => e.stopPropagation()} sx={{ mt: 2 }}>
          {children}
          <DisableOverlay />
        </DisableWrapper>
      </Wrapper>
    )
  }

  if (!isWalletNetworkSupported) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <w3m-network-button />
        <DisableWrapper onClick={(e) => e.stopPropagation()} sx={{ mt: 2 }}>
          {children}
          <DisableOverlay />
        </DisableWrapper>
      </Wrapper>
    )
  }

  if (onlyCreator && !isCreator) {
    return (
      <RequiredCreatorAccess>
        <DisableWrapper onClick={(e) => e.stopPropagation()} sx={{ mt: 2 }}>
          {children}
          <DisableOverlay />
        </DisableWrapper>
      </RequiredCreatorAccess>
    )
  }

  return <>{children}</>
}

export { PreventActionWithoutConnection }
