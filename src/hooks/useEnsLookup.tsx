import { useEnsAvatar, useEnsName } from 'wagmi'

type EnsLookupResult = {
  ensNameOrAddress: `0x${string}` | string | undefined
  isEnsName: boolean
  avatar: string | null
}

export const useEnsReverseLookup = function (address: `0x${string}` | undefined): EnsLookupResult {
  const { data: ensName } = useEnsName({
    address,
  })

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
  })

  return { ensNameOrAddress: ensName || address, avatar: ensAvatar || null, isEnsName: !!ensName }
}
