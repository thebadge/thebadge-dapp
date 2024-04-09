import * as React from 'react'
import { useCallback, useMemo } from 'react'

import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { providers } from 'ethers'
import useSWR from 'swr'
import { Account, Client, Transport } from 'viem'
import { Chain } from 'viem/chains'
import { Config, Connector, useConnect, useConnectorClient } from 'wagmi'

import { getNetworkConfig } from '@/src/config/web3'
import { ChainsValues } from '@/types/chains'

// export function walletClientToSigner(walletClient: WalletClient) {
//   const { account, chain, transport } = walletClient
//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   }
//   const provider = new providers.Web3Provider(transport, network)
//   return provider.getSigner(account.address)
// }

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}
/**
 * Replacement for useWalletClient from wagmi that is not working as expected
 * @param address Used just to trigger a new getWalletClient in case
 * that a new wallet is connected
 * @param chainId
 * @deprecated
 */
export function useWalletClientHandcraft({
  address,
  chainId,
}: {
  chainId?: number
  address?: string
}) {
  const { connectors } = useConnect()

  async function getWalletClient(connector: Connector) {
    try {
      // TODO: Try to find a method to know if is the right one, without need
      //  to do getWalletClient and ignore the error if its not
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return await connector.getWalletClient({ chainId })
    } catch (e) {
      // Just ignore the error
      return null
    }
  }

  return useSWR(['useWalletClientHandcraft', chainId, address], async () => {
    for (const connector of connectors) {
      // We go and check each connector to see with one is used and get the wallet
      const walletClient = await getWalletClient(connector)
      if (walletClient) return walletClient
    }
    return null
  })
}

type EthersSignerProps = {
  chainId: ChainsValues
  isAppChainReadOnly: boolean
  address?: string
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId, isAppChainReadOnly }: EthersSignerProps) {
  const { data: client } = useConnectorClient<Config>({ chainId })

  const readOnlyAppProvider = useMemo(() => {
    return new JsonRpcProvider(getNetworkConfig(chainId)?.rpcUrl, chainId)
  }, [chainId])

  const ethersSigner = React.useMemo(() => {
    return client ? clientToSigner(client) : readOnlyAppProvider
  }, [client, readOnlyAppProvider])

  const getCustomEthersSigner = useCallback(
    ({ chainId }: EthersSignerProps): JsonRpcProvider | JsonRpcSigner => {
      return new JsonRpcProvider(getNetworkConfig(chainId)?.rpcUrl, chainId)
    },
    [],
  )

  return {
    ethersSigner: isAppChainReadOnly ? readOnlyAppProvider : ethersSigner,
    readOnlyAppProvider,
    getCustomEthersSigner,
  }
}
