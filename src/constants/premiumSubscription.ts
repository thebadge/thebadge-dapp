import { Chains } from '@/src/config/web3'
import { contracts } from '@/src/contracts/contracts'
import { BadgeRequired } from '@/src/hooks/theBadge/useBadgesRequired'
import { ChainsValues } from '@/types/chains'

// Maybe improve or export to the backend
export const RequiredPremiumBadges: BadgeRequired[] = [
  {
    id: 0,
    networkId: Chains.goerli,
    contractAddress: contracts.TheBadge.address[Chains.goerli],
  },
  {
    id: 67,
    networkId: Chains.sepolia,
    contractAddress: contracts.TheBadge.address[Chains.sepolia],
  },
  {
    id: 0,
    networkId: Chains.mumbai,
    contractAddress: contracts.TheBadge.address[Chains.mumbai],
  },
  {
    id: 0,
    networkId: Chains.gnosis,
    contractAddress: contracts.TheBadge.address[Chains.gnosis],
  },
  {
    id: 0,
    networkId: Chains.polygon,
    contractAddress: contracts.TheBadge.address[Chains.polygon],
  },
]

export const getRequiredPremiumBadgeByNetworkId = (
  networkId: ChainsValues,
): BadgeRequired | undefined => {
  return RequiredPremiumBadges.find((badge) => badge.networkId === networkId)
}
