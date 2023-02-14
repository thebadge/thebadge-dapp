import Kleros from './abis/Kleros.json'
import KlerosBadgeTypeController from './abis/KlerosBadgeTypeController.json'
import TCR from './abis/TCR.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0xb1e4285EB9c95e64619BFFBA3847c6DF74Fc62F2',
    },
    abi: TheBadge,
  },
  KlerosBadgeTypeController: {
    address: {
      [Chains.goerli]: '0x12d23d9B35dC4CF7f7c36CC690937e7BadF36807',
    },
    abi: KlerosBadgeTypeController,
  },
  Kleros: {
    address: {
      [Chains.goerli]: '0x1128ed55ab2d796fa92d2f8e1f336d745354a77a',
    },
    abi: Kleros,
  },
  TCR: {
    address: {
      [Chains.goerli]: null,
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
