import { ContractsKeys, contracts } from '@/src/contracts/contracts'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { useEthersSigner } from '@/src/hooks/etherjs/useEthersSigner'
import * as typechainImports from '@/types/generated/typechain'
import { ObjectValues } from '@/types/utils'

type GetFactories<T> = T extends { connect: (...args: never) => unknown } ? T : never

type AppFactories = GetFactories<ObjectValues<typeof typechainImports>>

export const useContractInstance = <F extends AppFactories, RT extends ReturnType<F['connect']>>(
  contractFactory: F,
  contractKey: ContractsKeys,
  address?: string,
) => {
  const { appChainId } = useWeb3Connection()
  const signer = useEthersSigner({ chainId: appChainId })
  const _address = address ? address : contracts[contractKey]['address'][appChainId]
  if (!_address) throw `Address for ${contractKey} and ${appChainId} is null`
  if (!signer) throw 'There is no signer to execute the transaction.'

  return contractFactory.connect(_address, signer) as RT
}
