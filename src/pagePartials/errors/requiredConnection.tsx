import React, { ReactElement, ReactNode } from 'react'

import { styled } from '@mui/material'

import ConnectWalletError from '@/src/pagePartials/errors/displays/ConnectWalletError'
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
  noCloseButton?: boolean
}

const RequiredConnection: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  noCloseButton,
  ...restProps
}) => {
  const { address, isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const isConnected = isWalletConnected && address

  if (!isConnected) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <ConnectWalletError noCloseButton={noCloseButton} />
      </Wrapper>
    )
  }

  if (!isWalletNetworkSupported) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <w3m-network-button />
      </Wrapper>
    )
  }

  return <>{children}</>
}

export { RequiredConnection }
