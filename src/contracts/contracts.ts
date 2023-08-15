import Kleros from './abis/Kleros.json'
import KlerosBadgeModelController from './abis/KlerosBadgeModelController.json'
import TCR from './abis/TCR.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0xeCc0B0B2715bc6b6a0E42Eb9A7139aE28A360045',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge,
  },
  KlerosBadgeModelController: {
    address: {
      [Chains.goerli]: '0x84a93d11E9973826095ED7D0a0388949Eed38d63',
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
