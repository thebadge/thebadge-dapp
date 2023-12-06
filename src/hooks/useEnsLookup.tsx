import { useEnsAvatar, useEnsName } from 'wagmi'

import { Chains } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { WCAddress } from '@/types/utils'

type EnsLookupResult = {
  ensNameOrAddress: WCAddress | string | undefined
  isEnsName: boolean
  avatar: string | null
}

export const useEnsReverseLookup = function (address: WCAddress | undefined): EnsLookupResult {
  const { readOnlyChainId } = useWeb3Connection()

  // Gnosis does not support ens, we fallback to mainnet
  const ensChainId = readOnlyChainId === Chains.gnosis ? 1 : readOnlyChainId
  const { data: ensName } = useEnsName({
    address,
    chainId: ensChainId,
  })

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: ensChainId,
  })

  return { ensNameOrAddress: ensName || address, avatar: ensAvatar || null, isEnsName: !!ensName }
}
