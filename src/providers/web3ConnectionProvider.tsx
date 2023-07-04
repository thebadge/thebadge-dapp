import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { OnboardAPI, WalletState } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import { init, useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import walletConnectModule from '@web3-onboard/walletconnect'
import web3authModule from '@web3-onboard/web3auth'
import { UserInfo } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import nullthrows from 'nullthrows'

import {
  Chains,
  INITIAL_APP_CHAIN_ID,
  WALLET_CONNECT_ID,
  chainsConfig,
  getNetworkConfig,
} from '@/src/config/web3'
import { WEB3_AUTH_CLIENT_ID, appName } from '@/src/constants/common'
import {
  recoverLocalStorageKey,
  removeLocalStorageKey,
  setLocalStorageKey,
} from '@/src/hooks/usePersistedState'
import isDev from '@/src/utils/isDev'
import { hexToNumber } from '@/src/utils/strings'
import { ChainConfig, ChainsValues } from '@/types/chains'
import { RequiredNonNull } from '@/types/utils'

const STORAGE_CONNECTED_WALLET = 'onboard_selectedWallet'

// Default chain id from env var
nullthrows(
  Object.values(Chains).includes(INITIAL_APP_CHAIN_ID) ? INITIAL_APP_CHAIN_ID : null,
  'No default chain ID is defined or is not supported',
)
nullthrows(
  WALLET_CONNECT_ID ? WALLET_CONNECT_ID : null,
  'No default NEXT_PUBLIC_WALLET_CONNECT is defined or is not supported',
)

const injected = injectedModule()
const wcInitOptions = {
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT || '',
  /**
   * Chains required to be supported by all wallets connecting to your DApp
   */
  requiredChains: [Chains.goerli, Chains.gnosis],
}
const walletConnect = walletConnectModule(wcInitOptions)
const web3auth = web3authModule({
  clientId: WEB3_AUTH_CLIENT_ID, // Get your Client ID from Web3Auth Dashboard
  authMode: 'WALLET', // Enables only social wallets
  chainConfig: {
    chainNamespace: 'eip155',
    chainId: isDev
      ? chainsConfig[Chains.goerli].chainIdHex
      : chainsConfig[Chains.goerli].chainIdHex, // @todo (agustin) change with prod
    displayName: '1231231 Test',
    ticker: isDev ? chainsConfig[Chains.goerli].token : chainsConfig[Chains.goerli].token, // @todo (agustin) change with prod
    tickerName: isDev ? chainsConfig[Chains.goerli].token : chainsConfig[Chains.goerli].token, // @todo (agustin) change with prod
    rpcTarget: isDev ? chainsConfig[Chains.goerli].rpcUrl : chainsConfig[Chains.goerli].rpcUrl, // @todo (agustin) change with prod
    blockExplorer: isDev
      ? chainsConfig[Chains.goerli].blockExplorerUrls[0]
      : chainsConfig[Chains.goerli].blockExplorerUrls[0], // @todo (agustin) change with prod
  },
  uiConfig: {
    appName,
    appLogo: 'https://avatars.githubusercontent.com/u/109973181?s=200&v=4',
    modalZIndex: '13002', // Onboard modal is 13001
    defaultLanguage: 'en',
    web3AuthNetwork: isDev ? 'testnet' : 'mainnet',
  },
})

const chainsForOnboard = Object.values(chainsConfig).map(
  ({ chainIdHex, name, rpcUrl, token }: ChainConfig) => ({
    id: chainIdHex,
    label: name,
    token,
    rpcUrl,
  }),
)

let onBoardApi: OnboardAPI

export function initOnboard() {
  if (typeof window === 'undefined' || window?.onboard || onBoardApi) return

  onBoardApi = init({
    wallets: [injected, walletConnect, web3auth],
    chains: chainsForOnboard,
    notify: {
      enabled: false,
    },
    appMetadata: {
      name: appName || '',
      icon: '<svg><svg/>', // brand icon
      description: 'The Badge DApp',
      recommendedInjectedWallets: [{ name: 'MetaMask', url: 'https://metamask.io' }],
    },
    // Account center put an interactive menu in the UI to manage your account.
    accountCenter: {
      desktop: {
        enabled: false,
      },
      mobile: {
        enabled: false,
      },
    },
    // i18n: {} change all texts in the onboard modal
  })
  window.onboard = onBoardApi
}

declare type SetChainOptions = {
  chainId: string
  chainNamespace?: string
}

export type Web3Context = {
  address: string | null
  appChainId: ChainsValues
  balance?: Record<string, string> | null
  connectWallet: () => Promise<void> | null
  connectingWallet: boolean
  disconnectWallet: () => Promise<void> | null
  getExplorerUrl: (hash: string) => string
  isAppConnected: boolean
  isOnboardChangingChain: boolean
  isWalletConnected: boolean
  isWalletNetworkSupported: boolean
  isSocialWallet: boolean
  pushNetwork: (options: SetChainOptions) => Promise<boolean>
  readOnlyAppProvider: JsonRpcProvider
  setAppChainId: Dispatch<SetStateAction<ChainsValues>>
  wallet: WalletState | null
  walletChainId: number | null
  web3Provider: Web3Provider | null
  web3AuthInstance: Web3Auth | null
  userSocialInfo: Partial<UserInfo> | undefined
}

export type Web3Connected = RequiredNonNull<Web3Context>

const Web3ContextConnection = createContext<Web3Context | undefined>(undefined)

type Props = {
  children: ReactNode
}

//Initialize onboarding
initOnboard()

export default function Web3ConnectionProvider({ children }: Props) {
  const [{ connecting: connectingWallet, wallet }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()

  const [appChainId, setAppChainId] = useState(INITIAL_APP_CHAIN_ID)
  const [address, setAddress] = useState<string | null>(null)
  const [isSocialWallet, setIsSocialWallet] = useState<boolean>(false)
  const [web3AuthInstance, setWeb3AuthInstance] = useState<Web3Auth | null>(null)
  const [userSocialInfo, setUserSocialInfo] = useState<Partial<UserInfo> | undefined>(undefined)

  const web3Provider = wallet?.provider != null ? new Web3Provider(wallet.provider) : null

  const walletChainId = hexToNumber(connectedChain?.id)

  const isWalletConnected = web3Provider != null && address != null

  const isAppConnected = isWalletConnected && walletChainId === appChainId

  const isWalletNetworkSupported = chains.some(({ id }) => id === connectedChain?.id)

  const readOnlyAppProvider = useMemo(
    () => new JsonRpcProvider(getNetworkConfig(appChainId)?.rpcUrl, appChainId),
    [appChainId],
  )

  useEffect(() => {
    if (isWalletNetworkSupported && walletChainId) {
      setAppChainId(walletChainId as SetStateAction<ChainsValues>)
    }
  }, [walletChainId, isWalletNetworkSupported])

  // Save connected wallets to localstorage
  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(({ label }) => label)
    setLocalStorageKey(STORAGE_CONNECTED_WALLET, connectedWalletsLabelArray)
  }, [connectedWallets, wallet])

  // Set user address when connect wallet
  useEffect(() => {
    const address = wallet?.accounts[0]?.address
    if (wallet && address) {
      setAddress(address)
    } else {
      setAddress(null)
    }
  }, [wallet])

  // Recovers the web3AuthInstance if connected
  useEffect(() => {
    const fetchWeb3AuthInstance = async () => {
      if (wallet?.label.toLowerCase().includes('web3auth')) {
        setWeb3AuthInstance(wallet?.instance as Web3Auth)
        setIsSocialWallet(true)
      } else {
        setWeb3AuthInstance(null)
        setIsSocialWallet(false)
      }
    }
    if (wallet && wallet.instance) {
      fetchWeb3AuthInstance()
    }
  }, [wallet])

  // Recovers the user social account if connected via social
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await web3AuthInstance?.getUserInfo()
      setUserSocialInfo(userInfo)
    }
    if (web3AuthInstance && isSocialWallet) {
      fetchUserInfo()
    }
  }, [isSocialWallet, web3AuthInstance])

  // Auto connect wallet if localStorage has values
  useEffect(() => {
    const previouslyConnectedWallets = recoverLocalStorageKey(STORAGE_CONNECTED_WALLET, [])
    if (previouslyConnectedWallets?.length && !connectedWallets.length) {
      const setWalletFromLocalStorage = async () =>
        await connect({
          autoSelect: { label: previouslyConnectedWallets[0], disableModals: true },
        })

      setWalletFromLocalStorage()
    }
  }, [connect, chains, connectedWallets.length])

  const getExplorerUrl = useMemo(() => {
    const url = chainsConfig[appChainId]?.blockExplorerUrls[0]
    return (hash: string) => {
      const type = hash.length > 42 ? 'tx' : 'address'
      return `${url}${type}/${hash}`
    }
  }, [appChainId])

  const handleDisconnectWallet = async () => {
    if (wallet) {
      removeLocalStorageKey(STORAGE_CONNECTED_WALLET)
      disconnect(wallet)
    }
  }

  const handleConnectWallet = async () => {
    if (window.onboard) {
      connect()
    }
  }

  const value = {
    address: address ? address.toLowerCase() : null,
    appChainId,
    balance: wallet?.accounts[0]?.balance,
    connectWallet: handleConnectWallet,
    connectedChain,
    connectingWallet,
    disconnectWallet: handleDisconnectWallet,
    getExplorerUrl,
    isAppConnected,
    isOnboardChangingChain: settingChain,
    isWalletConnected,
    isWalletNetworkSupported,
    isSocialWallet,
    pushNetwork: setChain,
    readOnlyAppProvider,
    setAppChainId,
    settingChain,
    wallet,
    walletChainId,
    web3Provider,
    web3AuthInstance,
    userSocialInfo,
  }

  return <Web3ContextConnection.Provider value={value}>{children}</Web3ContextConnection.Provider>
}

export function useWeb3Connection() {
  const context = useContext(Web3ContextConnection)
  if (context === undefined) {
    throw new Error('useWeb3Connection must be used within a Web3ConnectionProvider')
  }
  return context
}

export function useWeb3ConnectedApp() {
  const context = useWeb3Connection()
  if (!context.isAppConnected) {
    throw new Error('useWeb3ConnectedApp must be used within a connected context')
  }
  return context as Web3Connected
}
