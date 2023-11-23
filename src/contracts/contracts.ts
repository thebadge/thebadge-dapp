import Kleros from './abis/Kleros.json'
import TheBadge from './abis/TheBadge.json'
import TheBadgeStore from './abis/TheBadgeStore.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x4e14816A80D7c4FeEeb56C225e821c6374F4AB56',
      [Chains.sepolia]: '0x4e14816A80D7c4FeEeb56C225e821c6374F4AB56',
      [Chains.gnosis]: '0x5f90580636AE29a9E4CD2AFFCE6d73501cD594F2',
    },
    abi: TheBadge.abi,
  },
  TheBadgeUsers: {
    address: {
      [Chains.goerli]: '0xbAaA5510144470eBE7260B743CA5516596A0250E',
      [Chains.sepolia]: '0xbAaA5510144470eBE7260B743CA5516596A0250E',
      [Chains.gnosis]: '0x8C0DcD187127b88665fE8FD4F39Cb18758946C0f',
    },
    abi: TheBadge.abi,
  },
  TheBadgeModels: {
    address: {
      [Chains.goerli]: '0xDb5c2bcfD8cc522B8DD634DC507E135383049566',
      [Chains.sepolia]: '0xDb5c2bcfD8cc522B8DD634DC507E135383049566',
      [Chains.gnosis]: '0x277D01AACE02C9e6Fa617Ea61Ece24BEDa46453c',
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
      [Chains.gnosis]: '0x9C1dA9A04925bDfDedf0f6421bC7EEa8305F9002',
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
