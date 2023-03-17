import Kleros from './abis/Kleros.json'
import KlerosBadgeTypeController from './abis/KlerosBadgeTypeController.json'
import TCR from './abis/TCR.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x059a97A4ad4D148B39209Fa9Be262E6E00E97804',
    },
    abi: TheBadge,
  },
  KlerosBadgeTypeController: {
    address: {
      [Chains.goerli]: '0x21bDD74A233339Ee96e6f208b118f29FbF27BdEA',
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
