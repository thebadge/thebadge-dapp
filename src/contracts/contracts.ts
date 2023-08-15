import Kleros from './abis/Kleros.json'
import KlerosBadgeModelController from './abis/KlerosBadgeModelController.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0xC11a50CAe9730920BC951DAaf235d80C455fBC52',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge,
  },
  KlerosBadgeModelController: {
    address: {
      [Chains.goerli]: '0x6854a34ee046BFdd611fe9893C504482df280964',
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
} as const

export type ContractsKeys = keyof typeof contracts

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return contracts[contractName as ContractsKeys] !== undefined
}
