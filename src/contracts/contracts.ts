import Kleros from './abis/Kleros.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0xF118b243eBBAB8166D23Eb98Ace86fEFdE62A748',
      [Chains.sepolia]: '0x70d6b6cdB3ce3FE21EefE4F967Bb2d8e12E0F701',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeUsers: {
    address: {
      [Chains.goerli]: '0x5Db75bA250eE4B675D9C7627BC11F2BC3b8c099f',
      [Chains.sepolia]: '0x38779E2d51181b461234B85Ee8D49cc2D24F2895',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeModels: {
    address: {
      [Chains.goerli]: '0xBaF92b831Ed905F791355fe9ECF0fce144712bdb',
      [Chains.sepolia]: '0xB7a687C965EF94478FB9a19812086B43A1Ca6ddb',
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
