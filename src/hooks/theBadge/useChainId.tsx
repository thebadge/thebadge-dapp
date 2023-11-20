import { useWeb3ModalState } from '@web3modal/wagmi/react'

import { ChainsValues } from '@/types/chains'

export default function useChainId() {
  const { selectedNetworkId } = useWeb3ModalState()

  return (selectedNetworkId || 11155111) as ChainsValues
}
