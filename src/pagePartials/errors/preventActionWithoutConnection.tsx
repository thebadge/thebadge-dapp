import React, { ReactElement, ReactNode } from 'react'

import { Button, styled } from '@mui/material'

import { chainsConfig } from '@/src/config/web3'
import ConnectWalletActionError from '@/src/pagePartials/errors/displays/ConnectWalletActionError'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

const DisableWrapper = styled('div')`
  display: flex;
  opacity: 0.6;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
  margin-top: 16px;
`

type RequiredConnectionProps = {
  children: ReactElement | ReactNode
  minHeight?: number
}

const PreventActionWithoutConnection: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  ...restProps
}) => {
  const { address, appChainId, isWalletConnected, pushNetwork, walletChainId } = useWeb3Connection()
  const isConnected = isWalletConnected && address
  const isWrongNetwork = isConnected && walletChainId !== appChainId

  if (!isConnected) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        <ConnectWalletActionError />
        <DisableWrapper onClick={(e) => e.stopPropagation()}>{children}</DisableWrapper>
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

export { PreventActionWithoutConnection }
