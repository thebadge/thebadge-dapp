import { useEffect, useState } from 'react'

import { createPublicClient, http } from 'viem'
import { Chain, gnosis, goerli, mainnet, polygon, polygonMumbai, sepolia } from 'viem/chains'

import { Chains } from '@/src/config/web3'
import { ChainsValues } from '@/types/chains'
import { WCAddress } from '@/types/utils'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

type EnsMetadata = {
  twitter: string | null
  linkedin: string | null
  github: string | null
  telegram: string | null
  mail: string | null
  description: string | null
  display: string | null
  url: string | null
}

type EnsLookupResult = {
  ensNameOrAddress: WCAddress | string | undefined
  isEnsName: boolean
  avatar: string | null
  metadata: EnsMetadata | null
}

const getChainByChainId = (chainId: ChainsValues): Chain => {
  switch (chainId) {
    case Chains.gnosis: {
      return gnosis
    }
    case Chains.polygon: {
      return polygon
    }
    case Chains.mumbai: {
      return polygonMumbai
    }
    case Chains.sepolia: {
      return sepolia
    }
    case Chains.goerli: {
      return goerli
    }
    default: {
      return mainnet
    }
  }
}

export const useEnsReverseLookup = function (address: WCAddress | undefined): EnsLookupResult {
  const { readOnlyChainId } = useWeb3Connection()
  const [ensName, setEnsName] = useState<string>(address as string)
  const [isEnsName, setIsEnsName] = useState<boolean>(false)
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null)
  const [ensMetadata, setEnsMetadata] = useState<EnsMetadata | null>(null)

  useEffect(() => {
    const chain = getChainByChainId(readOnlyChainId)
    const client = createPublicClient({
      chain,
      transport: http(),
    })
    const fetchInfo = async () => {
      const { getEnsAvatar, getEnsName, getEnsText } = client
      const ensName = await getEnsName({ address: address || '0x' })
      if (ensName) {
        setEnsName(ensName)
        setIsEnsName(true)
        const avatar = await getEnsAvatar({ name: ensName })
        const [twitter, linkedin, github, telegram, mail, description, display, url] =
          await Promise.all([
            getEnsText({ name: ensName, key: 'com.twitter' }),
            getEnsText({ name: ensName, key: 'com.linkedin' }),
            getEnsText({ name: ensName, key: 'com.github' }),
            getEnsText({ name: ensName, key: 'com.telegram' }),
            getEnsText({ name: ensName, key: 'mail' }),
            getEnsText({ name: ensName, key: 'description' }),
            getEnsText({ name: ensName, key: 'display' }),
            getEnsText({ name: ensName, key: 'url' }),
          ])
        setEnsAvatar(avatar)
        setEnsMetadata({
          twitter,
          linkedin,
          github,
          telegram,
          mail,
          description,
          display,
          url,
        })
      }
    }
    fetchInfo()
  }, [address, ensAvatar, readOnlyChainId])

  return {
    ensNameOrAddress: ensName || address,
    avatar: ensAvatar || null,
    isEnsName,
    metadata: ensMetadata,
  }
}
