import { Chains, getNetworkConfig } from '@/src/config/web3'
import { contracts } from '@/src/contracts/contracts'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { ChainsValues } from '@/types/chains'

// Validates that the prefix (the chainId) and the contractAddress
// Match with one our of deployed contractAddresses
const validateChainIdWithContractAddress = (
  chainId: ChainsValues | null,
  contractAddress: string,
): boolean => {
  if (!chainId) {
    return false
  }
  return contracts.TheBadge.address[chainId].toLowerCase() === contractAddress.toLowerCase()
}

const isValidChain = (chain: string): chain is keyof ChainsValues => {
  return Object.values(Chains).includes(Number(chain) as never)
}

export const parsePrefixedAddress = (
  fullContractAddress: string,
): {
  address: string
  chainId: ChainsValues
  subgraphName: SubgraphName
} => {
  const parts = fullContractAddress.split(':')
  const address = parts.length > 1 ? parts[1] : parts[0] || ''
  const chainId = parts.length > 1 ? parts[0] : ''

  // Validates that the networkId is valid
  const isValid = isValidChain(chainId)

  if (!isValid) {
    throw new Error(`The following prefix: ${chainId} is not a valid chainId`)
  }

  const prefixIsValid = validateChainIdWithContractAddress(
    chainId as unknown as ChainsValues,
    address,
  )

  if (!prefixIsValid) {
    throw new Error(
      `The following prefix: ${chainId} and the contract address: ${address} are not a valid deployed version combination`,
    )
  }

  return {
    chainId: Number(chainId) as unknown as ChainsValues,
    address,
    subgraphName: SubgraphName.TheBadge,
  }
}
