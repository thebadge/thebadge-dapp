import { http } from 'viem'
import { avalanche, gnosis, goerli, optimism, polygon, polygonMumbai, sepolia } from 'wagmi/chains'

export const DEFAULT_CHAINS = [
  sepolia,
  goerli,
  polygonMumbai,
  polygon,
  gnosis,
  avalanche,
  optimism,
] as const
export const DEFAULT_TRANSPORTS = {
  [sepolia.id]: http(),
  [goerli.id]: http(),
  [polygonMumbai.id]: http(),
  [polygon.id]: http(),
  [gnosis.id]: http(),
  [avalanche.id]: http(),
  [optimism.id]: http(),
}
export function getValidNetwork(
  selectedNetworkId: string | `${string}:${string}` | number | undefined,
) {
  return DEFAULT_CHAINS.find(({ id }) => {
    return id === Number(selectedNetworkId)
  })?.id
}
