import { useEnsAvatar, useEnsName } from 'wagmi'

import { WCAddress } from '@/types/utils'

type EnsLookupResult = {
  ensNameOrAddress: WCAddress | string | undefined
  isEnsName: boolean
  avatar: string | null
}

export const useEnsReverseLookup = function (address: WCAddress | undefined): EnsLookupResult {
  const { data: ensName } = useEnsName({
    address,
  })

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
  })

  return { ensNameOrAddress: ensName || address, avatar: ensAvatar || null, isEnsName: !!ensName }
}
