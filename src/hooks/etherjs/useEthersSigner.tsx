import * as React from 'react'

import { providers } from 'ethers'
import useSWR from 'swr'
import { Connector, type WalletClient, useConnect } from 'wagmi'

import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  return provider.getSigner(account.address)
}

/**
 * Replacement for useWalletClient from wagmi that is not working as expected
 * @param address Used just to trigger a new getWalletClient in case
 * that a new wallet is connected
 * @param chainId
 */
function useWalletClientHandcraft({
  address,
  chainId,
}: {
  chainId?: number
  address: `0x${string}` | undefined
}) {
  const { connectors } = useConnect()

  async function getWalletClient(connector: Connector<any, any>) {
    try {
      // TODO: Try to find a method to know if is the right one, without need
      //  to do getWalletClient and ignore the error if its not
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

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { address } = useWeb3Connection()
  const { data: walletClient } = useWalletClientHandcraft({ chainId, address })
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  )
}
