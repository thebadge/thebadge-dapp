import { Button, keyframes, styled } from '@mui/material'

import { getNetworkConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const loadingAnimation = keyframes`
  0% {
    opacity: var(--inline-loading-opacity-start);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: var(--inline-loading-opacity-start);
  }
`

const Content = styled('div')`
  --inline-loading-opacity-start: 0.4;

  animation-delay: 0ms;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: ${loadingAnimation};
  animation-timing-function: ease-in-out;
  color: ${({ theme }) => theme.palette.error.main};
  font-style: italic;

  display: flex;
  align-items: center;
`

export default function WrongNetwork() {
  const { appChainId, isWalletConnected, isWalletNetworkSupported, pushNetwork } =
    useWeb3Connection()
  const appChain = getNetworkConfig(appChainId)
  return isWalletConnected && !isWalletNetworkSupported ? (
    <Button onClick={() => pushNetwork({ chainId: appChain.chainIdHex })}>
      <Content>Switch to valid network</Content>
    </Button>
  ) : null
}
