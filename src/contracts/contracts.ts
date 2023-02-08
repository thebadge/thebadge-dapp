import ERC20 from './abis/ERC20.json'
import Kleros from './abis/Kleros.json'
import KlerosBadgeTypeController from './abis/KlerosBadgeTypeController.json'
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
  DAI: {
    address: {
      // [Chains.mainnet]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      [Chains.goerli]: '0x5c221e77624690fff6dd741493d735a17716c26b',
    },
    abi: ERC20,
  },
  USDC: {
    address: {
      // [Chains.mainnet]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [Chains.goerli]: '0x78dEca24CBa286C0f8d56370f5406B48cFCE2f86',
    },
    abi: ERC20,
  },
} as const

export type ContractsKeys = keyof typeof contracts

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return contracts[contractName as ContractsKeys] !== undefined
}
