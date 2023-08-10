import Kleros from './abis/Kleros.json'
import KlerosBadgeModelController from './abis/KlerosBadgeModelController.json'
import TCR from './abis/TCR.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x14df35633D0d4DB8a6aA6C4c621dBEA7D0530B92',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge,
  },
  KlerosBadgeModelController: {
    address: {
      [Chains.goerli]: '0x6d309F475fB01e1e94F49F99E8A15b5d13F352e4',
      [Chains.gnosis]: 'null',
    },
    abi: KlerosBadgeModelController,
  },
  Kleros: {
    address: {
      [Chains.goerli]: '0x1128ed55ab2d796fa92d2f8e1f336d745354a77a',
      [Chains.gnosis]: 'null',
    },
    abi: Kleros,
  },
  TCR: {
    address: {
      [Chains.goerli]: 'null',
      [Chains.gnosis]: 'null',
    },
    abi: TCR,
  },
} as const

export type ContractsKeys = keyof typeof contracts

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return contracts[contractName as ContractsKeys] !== undefined
}
