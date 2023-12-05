// 'use client'

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { JsonRpcProvider } from '@ethersproject/providers'
import { getPublicCompressed } from '@toruslabs/eccrypto'
import { InjectedConnector } from '@wagmi/connectors/injected'
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'
import { WalletConnectModal } from '@walletconnect/modal'
import { Web3Auth } from '@web3auth/modal'
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings,
} from '@web3auth/wallet-connect-v2-adapter'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { walletConnectProvider } from '@web3modal/wagmi'
import { createWeb3Modal, useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react'
import useSWR from 'swr'
import { gnosis, goerli, polygon, polygonMumbai, sepolia } from 'viem/chains'
import { WagmiConfig, configureChains, createConfig, useAccount, useDisconnect } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { Chains, INITIAL_APP_CHAIN_ID, chainsConfig, getNetworkConfig } from '@/src/config/web3'
import {
  APP_URL,
  TERMS_AND_CONDITIONS_URL,
  WEB3_AUTH_CLIENT_ID_PRODUCTION,
  WEB3_AUTH_CLIENT_ID_TESTNET,
  WEB3_MODAL_PROJECT_ID,
  appName,
} from '@/src/constants/common'
import { isTestnet } from '@/src/utils/network'
import { ChainsValues } from '@/types/chains'
import { WCAddress } from '@/types/utils'

// 1. Get projectId
const projectId = WEB3_MODAL_PROJECT_ID
if (!projectId) {
  throw new Error('WEB3_MODAL_PROJECT_ID is not set')
}

// 2. Create wagmiConfig
const metadata = {
  name: appName || '',
  description: 'The Badge DApp',
  url: APP_URL,
  icons: ['/favicon/favicon-32x32.png', '/favicon/favicon.svg'],
}

// 2. Chains supported
const defaultChains = [sepolia, goerli, polygonMumbai, polygon, gnosis]

const { chains, publicClient } = configureChains(defaultChains, [
  walletConnectProvider({ projectId }),
  publicProvider(),
])

let web3AuthInstance: Web3Auth | null = null

// 2.1. Add Social Login with web3Auth
// Set up your Web3Auth instance with all the features you want
async function initWeb3Auth() {
  if (web3AuthInstance) return web3AuthInstance
  const { Web3Auth } = await import('@web3auth/modal')

  web3AuthInstance = new Web3Auth({
    clientId: isTestnet ? WEB3_AUTH_CLIENT_ID_TESTNET : WEB3_AUTH_CLIENT_ID_PRODUCTION, // Client ID from Web3Auth Dashboard
    authMode: 'WALLET', // Enables only social wallets
    chainConfig: {
      chainNamespace: 'eip155',
      chainId: isTestnet
        ? chainsConfig[Chains.sepolia].chainIdHex
        : chainsConfig[Chains.gnosis].chainIdHex,
      displayName: '1231231 Test',
      ticker: isTestnet ? chainsConfig[Chains.sepolia].token : chainsConfig[Chains.gnosis].token,
      tickerName: isTestnet
        ? chainsConfig[Chains.sepolia].token
        : chainsConfig[Chains.gnosis].token,
      rpcTarget: isTestnet
        ? chainsConfig[Chains.sepolia].rpcUrl
        : chainsConfig[Chains.gnosis].rpcUrl,
      blockExplorer: isTestnet
        ? chainsConfig[Chains.sepolia].blockExplorerUrls[0]
        : chainsConfig[Chains.gnosis].blockExplorerUrls[0],
    },
    uiConfig: {
      appName,
      appLogo: 'https://avatars.githubusercontent.com/u/109973181?s=201&v=4',
      modalZIndex: '13002', // Onboard modal is 13001
      defaultLanguage: 'en',
      // todo remove this on development, is an outstanding issue for deployment versions: https://github.com/orgs/Web3Auth/discussions/1143
      //web3AuthNetwork: 'mainnet',
      web3AuthNetwork: isTestnet ? 'testnet' : 'mainnet',
    },
  })

  const defaultWcSettings = await getWalletConnectV2Settings(
    'eip155',
    [1],
    '04309ed1007e77d1f119b85205bb779d',
  )
  const walletConnectModal = new WalletConnectModal({ projectId })
  const walletConnectV2Adapter = new WalletConnectV2Adapter({
    adapterSettings: { qrcodeModal: walletConnectModal, ...defaultWcSettings.adapterSettings },
    loginSettings: { ...defaultWcSettings.loginSettings },
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  web3AuthInstance.configureAdapter(walletConnectV2Adapter)
  return web3AuthInstance
}

// 3. Create Wagni Advance Config -> https://docs.walletconnect.com/web3modal/react/about
// And also using web3auth-wagmi-connector -> https://web3auth.io/docs/sdk/pnp/web/wagmi-connector
let wagmiConfig: any = null

async function createWagniConfig() {
  let web3AuthInternal: Web3Auth | null = null
  if (typeof window !== 'undefined') {
    web3AuthInternal = await initWeb3Auth()
  }
  return new Promise((resolve) => {
    if (wagmiConfig) resolve(wagmiConfig)
    wagmiConfig = createConfig({
      autoConnect: true,
      connectors: [
        new WalletConnectConnector({
          chains,
          options: { projectId, showQrModal: false, metadata },
        }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } }),
        ...(web3AuthInternal
          ? [new Web3AuthConnector({ chains, options: { web3AuthInstance: web3AuthInternal } })]
          : []),
      ],
      publicClient,
    })
    setupWeb3Modal()
    console.log('[Wagni Config]: Succeed')
    resolve(wagmiConfig)
  })
}

// 4. Select supported wallets (wallets that are displayed first)
const featuredWalletIds = [
  // Safe
  '225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f',
  // Rainbow
  '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
]

// 5. Create Web3Modal (Wallet Connect Modal)
function setupWeb3Modal() {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    featuredWalletIds,
    termsConditionsUrl: TERMS_AND_CONDITIONS_URL,
    defaultChain: isTestnet ? sepolia : gnosis,
  })
}

console.log('Running in testnet mode?: ', isTestnet)

type Props = {
  children: ReactNode
}

/**
 * Hook with SWR to Suspense the UI until we have the Wagni and
 * the wallets ready to go
 */
function useCustomWagmiConfig() {
  return useSWR(`createWagmiConfig`, async () => {
    return await createWagniConfig()
  })
}

function getValidNetwork(selectedNetworkId: `${string}:${string}` | undefined) {
  return chains.find(({ id }) => {
    return id === Number(selectedNetworkId)
  })?.id
}

export default function Web3Modal({ children }: Props) {
  const newConfig = useCustomWagmiConfig()

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <WagmiConfig config={newConfig.data}>{children}</WagmiConfig>
  )
}

// 5. Create our own wrapper Web3ContextConnection to be backwards compatible with the code
export type Web3Context = {
  address: WCAddress | undefined

  // Wallet connection
  connectingWallet: boolean
  isWalletConnected: boolean
  isWalletNetworkSupported: boolean
  isAppConnected: boolean
  isSocialWallet: boolean
  disconnectWallet: () => void | null
  connectWallet: () => Promise<void> | null

  // dApp helpers
  appChainId: ChainsValues
  selectedNetworkId: `${string}:${string}` | undefined
  getExplorerUrl: (hash: string) => string
  readOnlyAppProvider: JsonRpcProvider

  consoleAppConfig: VoidFunction
  web3Auth: Web3Auth | null
  getSocialCompressedPubKey: () => Promise<string | undefined>
}

export function useWeb3Connection(): Web3Context {
  const {
    address: checkSummedAddress,
    isConnected: isWalletConnected,
    isConnecting: connectingWallet,
  } = useAccount()
  // @TODO (agustin) check if there is a better way to do this
  const address = checkSummedAddress
    ? (checkSummedAddress.toLowerCase() as '0x${String}')
    : undefined
  const { disconnect: disconnectWallet } = useDisconnect()
  const { open: connectWallet } = useWeb3Modal()
  const { selectedNetworkId } = useWeb3ModalState()

  const [appChainId, setAppChainId] = useState<ChainsValues>(
    getValidNetwork(selectedNetworkId) || (Number(INITIAL_APP_CHAIN_ID) as ChainsValues),
  )

  // Social Login with Web3Auth
  const [web3Auth] = useState<Web3Auth | null>(web3AuthInstance)
  const [isSocialWallet, setIsSocialWallet] = useState<boolean>(false)

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

  // No sense logic to cast the type and ensure that appId is a supported network
  useEffect(() => {
    const newNetwork = getValidNetwork(selectedNetworkId)
    if (newNetwork) setAppChainId(newNetwork)
  }, [selectedNetworkId])

  const isAppConnected = Boolean(isWalletConnected && appChainId)

  const getExplorerUrl = useMemo(() => {
    const url = chainsConfig[appChainId]?.blockExplorerUrls[0]
    return (hash: string) => {
      const type = hash.length > 42 ? 'tx' : 'address'
      return `${url}${type}/${hash}`
    }
  }, [appChainId])

  const readOnlyAppProvider = useMemo(() => {
    return new JsonRpcProvider(getNetworkConfig(appChainId)?.rpcUrl, appChainId)
  }, [appChainId])

  const isWalletNetworkSupported = useMemo(() => {
    // Gnosis Chain is not supported on dev mode
    if (
      (isTestnet && `${selectedNetworkId}` === '100') ||
      (isTestnet && `${selectedNetworkId}` === '137')
    )
      return false
    return chains.some(({ id }) => {
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
      supportedNetworks: chains.map((c) => c.id),
    })
  }, [address, appChainId, isWalletConnected, isWalletNetworkSupported])

  return {
    address,
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
    selectedNetworkId,
    getExplorerUrl,
    readOnlyAppProvider,
    consoleAppConfig,
    web3Auth,
    getSocialCompressedPubKey,
  }
}
