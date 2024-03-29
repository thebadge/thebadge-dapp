import { isAddress } from 'ethers/lib/utils'
import useSWR from 'swr'
import { createPublicClient, http } from 'viem'
import { Chain, mainnet, sepolia } from 'viem/chains'
import { normalize } from 'viem/ens'

import { Chains } from '@/src/config/web3'
import { extractGitHubUsername, extractTwitterUsername } from '@/src/utils/strings'
import { ChainsValues } from '@/types/chains'
import { WCAddress } from '@/types/utils'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

const getChainForEnsLookup = (chainId: ChainsValues): Chain => {
  switch (chainId) {
    // Returns mainnet because ens is not supported on these chains
    case Chains.gnosis:
    case Chains.polygon:
    case Chains.mumbai:
    case Chains.goerli: {
      return mainnet
    }
    case Chains.sepolia: {
      return sepolia
    }
    default: {
      return mainnet
    }
  }
}

export const useEnsReverseLookup = function (address: WCAddress | string | undefined) {
  const { appChainId } = useWeb3Connection()

  return useSWR([appChainId, address], async ([_appChainId, _address]) => {
    const chain = getChainForEnsLookup(_appChainId)
    const client = createPublicClient({
      chain,
      transport: http(),
    })

    const { getEnsAvatar, getEnsName, getEnsText } = client
    const ensName = await getEnsName({ address: (_address as WCAddress) || '0x' })
    if (!ensName) {
      return {
        ensNameOrAddress: _address as string,
        avatar: null,
        isEnsName: false,
        metadata: null,
      }
    }
    const avatar = await getEnsAvatar({ name: ensName })
    const [twitter, linkedin, github, telegram, discord, email, description, name, url] =
      await Promise.all([
        getEnsText({ name: ensName, key: 'com.twitter' }),
        getEnsText({ name: ensName, key: 'com.linkedin' }),
        getEnsText({ name: ensName, key: 'com.github' }),
        getEnsText({ name: ensName, key: 'com.telegram' }),
        getEnsText({ name: ensName, key: 'com.discord' }),
        getEnsText({ name: ensName, key: 'email' }),
        getEnsText({ name: ensName, key: 'description' }),
        getEnsText({ name: ensName, key: 'name' }),
        getEnsText({ name: ensName, key: 'url' }),
      ])
    const parsedTwitter = extractTwitterUsername(twitter as string)
    const parsedGithub = extractGitHubUsername(github as string)
    const metadata = {
      twitter: parsedTwitter,
      linkedin,
      github: parsedGithub,
      telegram,
      discord,
      email,
      description,
      name,
      website: url,
    }

    return {
      ensNameOrAddress: ensName,
      avatar,
      isEnsName: true,
      metadata,
    }
  })
}

export const useEnsLookup = function (ensName: WCAddress | string | undefined) {
  const { readOnlyChainId } = useWeb3Connection()

  const isEthereumAddress = ensName ? isAddress(ensName) : false
  return useSWR(
    [readOnlyChainId, ensName, isEthereumAddress],
    async ([_appChainId, _ensName, _isEthereumAddress]) => {
      if (_isEthereumAddress) {
        return _ensName
      }

      const chain = getChainForEnsLookup(_appChainId)
      const client = createPublicClient({
        chain,
        transport: http(),
      })

      return await client.getEnsAddress({
        name: normalize(_ensName || ''),
      })
    },
  )
}
