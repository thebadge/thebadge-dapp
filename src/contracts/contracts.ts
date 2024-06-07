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
      [Chains.avax]: '0xd7859d7f8fc33Eee2df9edbafd247a2F398087a6',
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
      [Chains.avax]: '0xba42dC1C5aa0f1094806c2914aA916E2cFe3d10E',
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
      [Chains.avax]: '0xd53Ec6aB9242cD8f8A8aa839BA91BDeDe6219475',
    },
    abi: TheBadge.abi,
  },
  TheBadgeStore: {
    address: {
      [Chains.goerli]: '0x158A8379071d280e811dC7b670c22a0b46dC582D',
      [Chains.sepolia]: '0x158A8379071d280e811dC7b670c22a0b46dC582D',
      [Chains.gnosis]: '0xaDe4Dcc3613dc0b77593adb3D694F2F6f71E4125',
      [Chains.polygon]: '0x870cDfe4c9b4FFe0687b7f871f6e96793440B214',
      [Chains.mumbai]: '0xfA31e6E50d2Aa260434A056e7CaA3FD582B1FfE8',
      [Chains.avax]: '0xC1e5906C4bD80787EE859432331B2791bD9BbF12',
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
      [Chains.avax]: '0x0f7aa4776538b83a7afd4802880512979f7e8f93',
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
