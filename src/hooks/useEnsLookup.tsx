import { useEffect, useState } from 'react'

import { JsonRpcProvider } from '@ethersproject/providers'

import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

type EnsLookupResult = {
  ensNameOrAddress: string
  isEnsName: boolean
  avatar: string | null
}

export const useEnsReverseLookup = function (address: string): EnsLookupResult {
  const [ensNameOrAddress, setEnsNameOrAddress] = useState<EnsLookupResult>({
    ensNameOrAddress: address,
    isEnsName: false,
    avatar: null,
  })
  const { readOnlyAppProvider } = useWeb3Connection()

  useEffect(() => {
    const fakeEnsReverseLookup = async (address: string) => {
      // TODO: This should be removed later, currently we use this because gnosis chain does not support ens
      // And this allows that users with ens names in mainnet to use them in gnosis
      const mainnetChainId = 1
      const providerUrl = `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_TOKEN}`
      const readOnlyAppProvider = new JsonRpcProvider(providerUrl, mainnetChainId)
      const ensName = await readOnlyAppProvider.lookupAddress(address)

      if (ensName) {
        const avatar = await readOnlyAppProvider.getAvatar(ensName)
        setEnsNameOrAddress({ ensNameOrAddress: ensName, isEnsName: true, avatar })
      }
    }
    const ensReverseLookup = async (address: string) => {
      try {
        const ensName = await readOnlyAppProvider.lookupAddress(address)

        if (ensName) {
          const avatar = await readOnlyAppProvider.getAvatar(ensName)

          setEnsNameOrAddress({ ensNameOrAddress: ensName, isEnsName: true, avatar })
        }
      } catch (error) {
        console.warn('ENS not supported', error)
        fakeEnsReverseLookup(address)
      }
    }

    ensReverseLookup(address)
  }, [address, readOnlyAppProvider])

  return ensNameOrAddress
}
