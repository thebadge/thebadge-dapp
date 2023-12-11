import { useCallback } from 'react'

import { useEthersSigner } from '@/src/hooks/etherjs/useEthersSigner'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ChainsValues } from '@/types/chains'
import { ERC1155__factory } from '@/types/generated/typechain'

export type BadgeRequired = {
  badgeId: number
  networkId: ChainsValues
  contractAddress: string
}

// Returns true if the given address has balance > 0 in the given contract
// Otherwise returns false
export const useBadgesRequired = () => {
  const { readOnlyChainId } = useWeb3Connection()
  const { getCustomEthersSigner } = useEthersSigner({
    isAppChainReadOnly: true,
    chainId: readOnlyChainId,
  })

  const hasUserBalance = useCallback(
    async (badgeRequired: BadgeRequired, userAddress: string): Promise<boolean> => {
      try {
        const ethersSigner = getCustomEthersSigner({
          chainId: badgeRequired.networkId,
          isAppChainReadOnly: true,
        })
        const erc1155 = ERC1155__factory.connect(badgeRequired.contractAddress, ethersSigner)
        const balance = await erc1155.balanceOf(userAddress, badgeRequired.badgeId)
        return balance.toNumber() > 0
      } catch (error) {
        return false
      }
    },
    [getCustomEthersSigner],
  )

  return {
    hasUserBalance,
  }
}
