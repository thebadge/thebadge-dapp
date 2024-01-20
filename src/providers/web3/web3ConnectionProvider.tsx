// 'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { getPublicCompressed } from '@toruslabs/eccrypto'
import { Web3Auth } from '@web3auth/modal'
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'

import { DEFAULT_CHAINS, getValidNetwork } from './utils'
import { INITIAL_APP_CHAIN_ID, chainsConfig } from '@/src/config/web3'
import { useEthersSigner } from '@/src/hooks/etherjs/useEthersSigner'
import useNetworkQueryParam from '@/src/hooks/nextjs/useNetworkQueryParam'
import { Web3Context } from '@/src/providers/web3/types'
import { web3AuthInstance } from '@/src/providers/web3/web3ModalProvider'
import { isTestnet } from '@/src/utils/network'
import { ChainsValues } from '@/types/chains'
import { WCAddress } from '@/types/utils'

const useChainIds = (): {
  appChainId: ChainsValues
  selectedNetworkId: ChainsValues | undefined
  readOnlyChainId: ChainsValues
  // true if the user's selectedNetworkId if different than the appId
  isAppChainReadOnly: boolean
} => {
  const { selectedNetworkId } = useWeb3ModalState()
  const queryParamsChainId = useNetworkQueryParam()

  const [appChainId, setAppChainId] = useState<ChainsValues>(
    getValidNetwork(selectedNetworkId) || (Number(INITIAL_APP_CHAIN_ID) as ChainsValues),
  )

  // No sense logic to cast the type and ensure that appId is a supported network
  useEffect(() => {
    const newNetwork = getValidNetwork(selectedNetworkId)
    if (newNetwork) setAppChainId(newNetwork)
  }, [selectedNetworkId])

  return {
    appChainId,
    selectedNetworkId: getValidNetwork(selectedNetworkId) as ChainsValues,
    readOnlyChainId: queryParamsChainId ? queryParamsChainId : appChainId,
    isAppChainReadOnly: queryParamsChainId ? appChainId !== queryParamsChainId : false,
  }
}

export function useWeb3Connection(): Web3Context {
  const {
    address: checkSummedAddress,
    isConnected: isWalletConnected,
    isConnecting: connectingWallet,
  } = useAccount()

  const address = checkSummedAddress ? checkSummedAddress.toLowerCase() : undefined
  const { disconnect: disconnectWallet } = useDisconnect()
  const { open: connectWallet } = useWeb3Modal()

  // Social Login with Web3Auth
  const [web3Auth] = useState<Web3Auth | null>(web3AuthInstance)
  const [isSocialWallet, setIsSocialWallet] = useState<boolean>(false)
  const { appChainId, isAppChainReadOnly, readOnlyChainId, selectedNetworkId } = useChainIds()
  const { ethersSigner, readOnlyAppProvider } = useEthersSigner({
    chainId: readOnlyChainId,
    address,
    isAppChainReadOnly,
  })

  useEffect(() => {
    const checkIfItsSocialWallet = async () => {
      if (web3Auth?.connected) {
        const authUser = await web3Auth?.authenticateUser()
        if (authUser) setIsSocialWallet(true)
      }
    }
    checkIfItsSocialWallet()
  }, [web3Auth])

  const getSocialCompressedPubKey = useCallback<() => Promise<string | undefined>>(async () => {
    if (!web3Auth || !isSocialWallet) {
      console.warn('[getSocialCompressedPubKey] It can be used just with social wallets.')
      return
    }
    // If we support non-emv chains this should be private_key
    const appScopedPrivKey = (await web3Auth.provider?.request({
      method: 'eth_private_key',
    })) as string
    return getPublicCompressed(Buffer.from(appScopedPrivKey.padStart(64, '0'), 'hex')).toString(
      'hex',
    )
  }, [isSocialWallet, web3Auth])

  const isAppConnected = Boolean(isWalletConnected && appChainId)

  const getExplorerUrl = useMemo(() => {
    const url = chainsConfig[readOnlyChainId]?.blockExplorerUrls[0]
    return (hash: string) => {
      const type = hash.length > 42 ? 'tx' : 'address'
      return `${url}${type}/${hash}`
    }
  }, [readOnlyChainId])

  const isWalletNetworkSupported = useMemo(() => {
    // Gnosis Chain is not supported on dev mode
    if (
      (isTestnet && `${selectedNetworkId}` === '100') ||
      (isTestnet && `${selectedNetworkId}` === '137')
    )
      return false
    return DEFAULT_CHAINS.some(({ id }) => {
      return `${id}` === `${selectedNetworkId}`
    })
  }, [selectedNetworkId])

  const consoleAppConfig = useCallback<VoidFunction>(() => {
    if (!isTestnet) return
    console.log('[TB - Web3 Configs]', {
      address,
      isWalletConnected,
      isWalletNetworkSupported,
      appChainId,
      supportedNetworks: DEFAULT_CHAINS.map((c) => c.id),
    })
  }, [address, appChainId, isWalletConnected, isWalletNetworkSupported])

  return {
    address: address as WCAddress,
    isSocialWallet,

    // Wallet connection
    connectingWallet,
    isWalletConnected,
    isWalletNetworkSupported,
    isAppConnected,
    connectWallet,
    disconnectWallet,

    // dApp helpers
    appChainId,
    selectedNetworkId: selectedNetworkId ? selectedNetworkId : undefined,
    readOnlyChainId,
    getExplorerUrl,
    readOnlyAppProvider,
    consoleAppConfig,
    web3Auth,
    getSocialCompressedPubKey,
    ethersSigner,
  }
}
