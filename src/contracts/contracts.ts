import Kleros from './abis/Kleros.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x86F127fef233C799f2aA130cCc919045f954957d',
      [Chains.sepolia]: '0x83701fe7a462bD714A9006a9FF604367C24613E3',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeUsers: {
    address: {
      [Chains.goerli]: '0x196EF38Eca64a6FEa6E6Fc8AdF85Ac1BE44f4804',
      [Chains.sepolia]: '0x5E7c648EE852241f145e1d480932C091979883D1',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeModels: {
    address: {
      [Chains.goerli]: '0x20933724e3C2F177d8Cfe4b1CEEF829A17aD883B',
      [Chains.sepolia]: '0x5df8183d0B77Bea3B72391eB0c4c873d2fdDC6f2',
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
