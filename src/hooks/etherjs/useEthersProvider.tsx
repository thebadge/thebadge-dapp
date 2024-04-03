import * as React from 'react'

import { FallbackProvider, JsonRpcProvider } from '@ethersproject/providers'
import { providers } from 'ethers'
import { Client, Transport } from 'viem'
import { Chain } from 'viem/chains'
import { Config, useClient, usePublicClient } from 'wagmi'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

// export function publicClientToProvider(
//   publicClient: UsePublicClientReturnType | UseWalletClientReturnType,
// ) {
//   const { chain, transport } = publicClient
//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   }
//   if (transport.type === 'fallback')
//     return new providers.FallbackProvider(
//       (transport.transports as ReturnType<HttpTransport>[]).map(
//         ({ value }) => new providers.JsonRpcProvider(value?.url, network),
//       ),
//     )
//   return new providers.JsonRpcProvider(transport.url, network)
// }

export function clientToProvider(client?: Client<Transport, Chain>) {
  if (!client) return null
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId })
  const { appChainId } = useWeb3Connection()

  const client = useClient<Config>({ chainId: chainId || appChainId })

  return React.useMemo(
    () => (client ? clientToProvider(client) : clientToProvider(publicClient)),
    [publicClient, client],
  )
}

export function isJsonRpcProvider(
  object: FallbackProvider | JsonRpcProvider,
): object is JsonRpcProvider {
  return !(object instanceof FallbackProvider)
}
