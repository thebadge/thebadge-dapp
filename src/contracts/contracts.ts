import Kleros from './abis/Kleros.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x24a2cC73D3b33fa92B9dc299835ec3715FB033fB',
      [Chains.sepolia]: '0xE60E872Bb117AC85DBf62377557023DA9BB0e45f',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeUsers: {
    address: {
      [Chains.goerli]: '0x1e2D6FCF076726049F5554f848Fc332c052e0e5b',
      [Chains.sepolia]: '0xCd22f18524e6eCE2Fec58574184c0c713446229e',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeModels: {
    address: {
      [Chains.goerli]: '0x17179b1c18AB35c78C95dE4c57eDb08b6286D60a',
      [Chains.sepolia]: '0x874D3BCb8ac6fE0229F62aD2eddfe338E2500407',
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
