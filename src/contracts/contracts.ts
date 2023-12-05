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
      [Chains.polygon]: '0xE6c5c3174439DA7D2D60456Ca7eB97E7Dcd551e6',
      [Chains.mumbai]: '0xBc8B15322279D7DEDfA6f38EC22075491aEDDB0f',
    },
    abi: TheBadge.abi,
  },
  TheBadgeUsers: {
    address: {
      [Chains.goerli]: '0xbAaA5510144470eBE7260B743CA5516596A0250E',
      [Chains.sepolia]: '0xbAaA5510144470eBE7260B743CA5516596A0250E',
      [Chains.gnosis]: '0x8C0DcD187127b88665fE8FD4F39Cb18758946C0f',
      [Chains.polygon]: '0x8Edfc741aED6B2C43485983d4C7b6B095b00500c',
      [Chains.mumbai]: '0xAdCd2Cd1249211EeD1D4d72b1E8B53F3A792e5da',
    },
    abi: TheBadge.abi,
  },
  TheBadgeModels: {
    address: {
      [Chains.goerli]: '0xDb5c2bcfD8cc522B8DD634DC507E135383049566',
      [Chains.sepolia]: '0xDb5c2bcfD8cc522B8DD634DC507E135383049566',
      [Chains.gnosis]: '0x277D01AACE02C9e6Fa617Ea61Ece24BEDa46453c',
      [Chains.polygon]: '0x3C838b8571c53D29108F69b98145f8FcC446Fa5a',
      [Chains.mumbai]: '0x3540D8484C5ab270b53e16EDD71791d37A49BBf8',
    },
    abi: TheBadge.abi,
  },
  TheBadgeStore: {
    address: {
      [Chains.goerli]: '0x49F7e71dbad648faB6A273F15e363161744a1191',
      [Chains.sepolia]: '0x8de751B764334240E54B4177300Fa8De4301deBC',
      [Chains.gnosis]: '0xaDe4Dcc3613dc0b77593adb3D694F2F6f71E4125',
      [Chains.polygon]: '0x870cDfe4c9b4FFe0687b7f871f6e96793440B214',
      [Chains.mumbai]: '0xfA31e6E50d2Aa260434A056e7CaA3FD582B1FfE8',
    },
    abi: TheBadgeStore.abi,
  },
  Kleros: {
    address: {
      [Chains.goerli]: '0x1128ed55ab2d796fa92d2f8e1f336d745354a77a', // Arbitror address
      [Chains.sepolia]: '0x90992fb4e15ce0c59aeffb376460fda4ee19c879', // Arbitror address
      [Chains.gnosis]: '0x9C1dA9A04925bDfDedf0f6421bC7EEa8305F9002',
      [Chains.polygon]: '0x0f7aa4776538b83A7Afd4802880512979f7E8F93',
      [Chains.mumbai]: '0x0f7aa4776538b83a7afd4802880512979f7e8f93',
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
