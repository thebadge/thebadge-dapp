import Kleros from './abis/Kleros.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x5709c7f13FE36487Ebd2ed072AC9A0F43c33e86E',
      [Chains.sepolia]: '0xeCc0B0B2715bc6b6a0E42Eb9A7139aE28A360045',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeUsers: {
    address: {
      [Chains.goerli]: '0xdea84c826f3A191b150F606be1428427Dd69b2fc',
      [Chains.sepolia]: '0x593664b3ed9cA81b3ED09ED8001c3aCE4898af6A',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeModels: {
    address: {
      [Chains.goerli]: '0xF856D5729C0608e65Bf6B9E294729BaBBa10586d',
      [Chains.sepolia]: '0x38eA08318DD2D580E6f50F3c98Fb159B05D6261E',
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
