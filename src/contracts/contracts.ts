import Kleros from './abis/Kleros.json'
import TheBadge from './abis/TheBadge.json'
import { Chains } from '@/src/config/web3'

export const contracts = {
  TheBadge: {
    address: {
      [Chains.goerli]: '0x76149777Ce10AEd3c39C2D66F0A20E95c4fC2d96',
      [Chains.sepolia]: '0x83701fe7a462bD714A9006a9FF604367C24613E3',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeUsers: {
    address: {
      [Chains.goerli]: '0x873a18c9F91a3e4D69B885EA13857848445b87EE',
      [Chains.sepolia]: '0x5E7c648EE852241f145e1d480932C091979883D1',
      [Chains.gnosis]: 'null',
    },
    abi: TheBadge.abi,
  },
  TheBadgeModels: {
    address: {
      [Chains.goerli]: '0xa6aef6A5eA2E94CC72C158513Ae1e350EDcaAd56',
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
