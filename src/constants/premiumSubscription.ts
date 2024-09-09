import { Chains } from '@/src/config/web3'
import { contracts } from '@/src/contracts/contracts'
import { BadgeRequired } from '@/src/hooks/theBadge/useBadgesRequired'
import { ChainsValues } from '@/types/chains'

// Maybe improve or export to the backend
export const RequiredPremiumBadges: { [key in ChainsValues]: BadgeRequired[] } = {
  [Chains.goerli]: [
    {
      id: 0,
      networkId: Chains.goerli,
      contractAddress: contracts.TheBadge.address[Chains.goerli],
    },
  ],
  [Chains.sepolia]: [
    {
      id: 67,
      networkId: Chains.sepolia,
      contractAddress: contracts.TheBadge.address[Chains.sepolia],
    },
    {
      id: 74,
      networkId: Chains.sepolia,
      contractAddress: contracts.TheBadge.address[Chains.sepolia],
    },
    {
      id: 75,
      networkId: Chains.sepolia,
      contractAddress: contracts.TheBadge.address[Chains.sepolia],
    },
    {
      id: 76,
      networkId: Chains.sepolia,
      contractAddress: contracts.TheBadge.address[Chains.sepolia],
    },
  ],
  [Chains.mumbai]: [
    {
      id: 0,
      networkId: Chains.mumbai,
      contractAddress: contracts.TheBadge.address[Chains.mumbai],
    },
  ],
  [Chains.polygon]: [
    {
      id: 0,
      networkId: Chains.polygon,
      contractAddress: contracts.TheBadge.address[Chains.polygon],
    },
  ],
  [Chains.gnosis]: [
    {
      id: 0,
      networkId: Chains.gnosis,
      contractAddress: contracts.TheBadge.address[Chains.gnosis],
    },
  ],
  [Chains.avax]: [
    {
      id: 0,
      networkId: Chains.avax,
      contractAddress: contracts.TheBadge.address[Chains.gnosis],
    },
  ],
  [Chains.optimism]: [
    {
      id: 0,
      networkId: Chains.optimism,
      contractAddress: contracts.TheBadge.address[Chains.gnosis],
    },
  ],
}

export const getRequiredPremiumBadgesByNetworkId = (networkId: ChainsValues): BadgeRequired[] => {
  const requiredBadges = RequiredPremiumBadges[networkId]
  if (!requiredBadges.length) {
    throw new Error(`Invalid networkId: ${networkId}`)
  }
  return requiredBadges
}
