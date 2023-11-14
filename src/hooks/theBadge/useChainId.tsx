import { useWeb3ModalState } from '@web3modal/wagmi/react'

export default function useChainId() {
  const { selectedNetworkId } = useWeb3ModalState()

  return selectedNetworkId
}
