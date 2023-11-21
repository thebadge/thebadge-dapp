import * as React from 'react'

import { FallbackProvider, JsonRpcProvider } from '@ethersproject/providers'
import { providers } from 'ethers'
import { type HttpTransport } from 'viem'
import { PublicClient, WalletClient, usePublicClient } from 'wagmi'

import { useWalletClientHandcraft } from '@/src/hooks/etherjs/useEthersSigner'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export function publicClientToProvider(publicClient: PublicClient | WalletClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId })
  const { address, appChainId } = useWeb3Connection()

  const { data: walletClient } = useWalletClientHandcraft({
    chainId: chainId || appChainId,
    address,
  })
  return React.useMemo(
    () =>
      walletClient ? publicClientToProvider(walletClient) : publicClientToProvider(publicClient),
    [publicClient, walletClient],
  )
}

export function isJsonRpcProvider(
  object: FallbackProvider | JsonRpcProvider,
): object is JsonRpcProvider {
  return !(object instanceof FallbackProvider)
}
