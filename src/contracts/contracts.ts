import Kleros from './abis/Kleros.json'
import TheBadge from './abis/TheBadge.json'
import TheBadgeStore from './abis/TheBadgeStore.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x344DEeF65b47454E2CdCe24FFCFa12f32180253B',
      [Chains.sepolia]: '0x8D6E4aa214e3eD2E895E0B6938eED63dda4c8C73',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeUsers: {
    address: {
      [Chains.goerli]: '0x90d790998f8E19A10AAb8c504c7408c1E61F040a',
      [Chains.sepolia]: '0xa86D1858D751A2f71231456fC136c4837aD76009',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeModels: {
    address: {
      [Chains.goerli]: '0x156dA5dCA074AC3eFafa779bF24ECd0e02Fa8f18',
      [Chains.sepolia]: '0xced067Ee9Fa889156697Ea2B8fA79ced10119a3A',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeStore: {
    address: {
      [Chains.goerli]: '0x49F7e71dbad648faB6A273F15e363161744a1191',
      [Chains.sepolia]: '0x8de751B764334240E54B4177300Fa8De4301deBC',
      [Chains.gnosis]: '',
    },
    abi: TheBadgeStore.abi,
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
