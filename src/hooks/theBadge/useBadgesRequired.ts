import { useCallback } from 'react'

import { useEthersSigner } from '@/src/hooks/etherjs/useEthersSigner'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { ChainsValues } from '@/types/chains'
import { ERC1155__factory, TheBadge__factory } from '@/types/generated/typechain'

export type BadgeRequired = {
  id: number
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

  const hasUserBadgeBalance = useCallback(
    async (badgeRequired: BadgeRequired, userAddress: string): Promise<boolean> => {
      try {
        const ethersSigner = getCustomEthersSigner({
          chainId: badgeRequired.networkId,
          isAppChainReadOnly: true,
        })
        const erc1155 = ERC1155__factory.connect(badgeRequired.contractAddress, ethersSigner)
        const balance = await erc1155.balanceOf(userAddress, badgeRequired.id)
        return balance.toNumber() > 0
      } catch (error) {
        return false
      }
    },
    [getCustomEthersSigner],
  )

  const hasUserBadgeModelBalance = useCallback(
    async (badgeModelRequired: BadgeRequired, userAddress: string): Promise<boolean> => {
      try {
        const ethersSigner = getCustomEthersSigner({
          chainId: badgeModelRequired.networkId,
          isAppChainReadOnly: true,
        })
        const theBadge = TheBadge__factory.connect(badgeModelRequired.contractAddress, ethersSigner)
        const balance = await theBadge.balanceOfBadgeModel(userAddress, badgeModelRequired.id)
        return balance.toNumber() > 0
      } catch (error) {
        return false
      }
    },
    [getCustomEthersSigner],
  )

  return {
    hasUserBadgeBalance,
    hasUserBadgeModelBalance,
  }
}
