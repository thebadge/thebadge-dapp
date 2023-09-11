import Kleros from './abis/Kleros.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x641063Acf18E0D24d3F39bF2caaEEB461F7364Dd',
      [Chains.sepolia]: '0xec5b3e3E14D201D47fC7b7fE0F6Fc7833783A248',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeUsers: {
    address: {
      [Chains.goerli]: '0x02D3ADB3eD0aBf35118C4EbB2aA4900141ea2E6F',
      [Chains.sepolia]: 'null',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeModels: {
    address: {
      [Chains.goerli]: '0x5691238636b924d16192283854d97872b08272aA',
      [Chains.sepolia]: 'null',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  Kleros: {
    address: {
      [Chains.goerli]: '0x1128ed55ab2d796fa92d2f8e1f336d745354a77a', // Arbitror address
      [Chains.sepolia]: '0x90992fb4e15ce0c59aeffb376460fda4ee19c879', // Arbitror address
      [Chains.gnosis]: 'null',
    },
    abi: Kleros,
  },
} as const

export type ContractsKeys = keyof typeof contracts

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return contracts[contractName as ContractsKeys] !== undefined
}
