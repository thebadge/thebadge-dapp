import React, { ReactElement, ReactNode } from 'react'

import { Button, styled } from '@mui/material'

import { chainsConfig } from '@/src/config/web3'
import ConnectWalletError from '@/src/pagePartials/errors/displays/ConnectWalletError'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

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
  const { address, appChainId, isWalletConnected, pushNetwork, walletChainId } = useWeb3Connection()
  const isConnected = isWalletConnected && address
  const isWrongNetwork = isConnected && walletChainId !== appChainId

  if (!isConnected) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <ConnectWalletError noCloseButton={noCloseButton} />
      </Wrapper>
    )
  }

  if (isWrongNetwork) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <Button onClick={() => pushNetwork({ chainId: chainsConfig[appChainId].chainIdHex })}>
          Switch to {chainsConfig[appChainId].name}
        </Button>
      </Wrapper>
    )
  }

  return <>{children}</>
}

export { RequiredConnection }
