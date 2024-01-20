import { gnosis, goerli, polygon, polygonMumbai, sepolia } from 'viem/chains'

export const DEFAULT_CHAINS = [sepolia, goerli, polygonMumbai, polygon, gnosis]

export function getValidNetwork(selectedNetworkId: `${string}:${string}` | undefined) {
  return DEFAULT_CHAINS.find(({ id }) => {
    return id === Number(selectedNetworkId)
  })?.id
}
