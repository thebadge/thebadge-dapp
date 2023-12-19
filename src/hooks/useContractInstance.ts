import { ContractsKeys, contracts } from '@/src/contracts/contracts'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import * as typechainImports from '@/types/generated/typechain'
import { ObjectValues } from '@/types/utils'

type GetFactories<T> = T extends { connect: (...args: never) => unknown } ? T : never

type AppFactories = GetFactories<ObjectValues<typeof typechainImports>>

export const useContractInstance = <F extends AppFactories, RT extends ReturnType<F['connect']>>(
  contractFactory: F,
  contractKey: ContractsKeys,
  contractAddress?: string,
) => {
  const { ethersSigner: signer, readOnlyChainId } = useWeb3Connection()
  const _contractAddress = contractAddress
    ? contractAddress
    : contracts[contractKey]['address'][readOnlyChainId]
  if (!_contractAddress) throw `Address for ${contractKey} and ${readOnlyChainId} is null`
  if (!signer) throw 'There is no signer to execute the transaction.'

  return contractFactory.connect(_contractAddress, signer) as RT
}
