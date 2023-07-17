import Kleros from './abis/Kleros.json'
import KlerosController from './abis/KlerosController.json'
import TCR from './abis/TCR.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x641dDCeDe396fA1C2B1AF323523508D2f8fd6825',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge,
  },
  KlerosController: {
    address: {
      [Chains.goerli]: '0x6269Ae4D1Afae6bC88FF6Fbf09137deecB6799c7',
      [Chains.gnosis]: 'null',
    },
    abi: KlerosController,
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
