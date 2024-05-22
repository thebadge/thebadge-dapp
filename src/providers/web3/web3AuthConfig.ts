import { LANGUAGES } from '@toruslabs/openlogin-utils'
import { CustomChainConfig, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3Auth } from '@web3auth/modal'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'

import { Chains, chainsConfig } from '@/src/config/web3'
import {
  WEB3_AUTH_CLIENT_ID_PRODUCTION,
  WEB3_AUTH_CLIENT_ID_TESTNET,
  appName,
} from '@/src/constants/common'
import { isTestnet } from '@/src/utils/network'
import { isGitHubActionBuild } from '@/types/utils'

// 2.1. Add Social Login with web3Auth
// Set up your Web3Auth instance with all the features you want
const chainConfig: CustomChainConfig = {
  chainNamespace: 'eip155',
  chainId: isTestnet
    ? chainsConfig[Chains.sepolia].chainIdHex
    : chainsConfig[Chains.gnosis].chainIdHex,
  displayName: '1231231 Test',
  ticker: isTestnet ? chainsConfig[Chains.sepolia].token : chainsConfig[Chains.gnosis].token,
  tickerName: isTestnet ? chainsConfig[Chains.sepolia].token : chainsConfig[Chains.gnosis].token,
  rpcTarget: isTestnet ? chainsConfig[Chains.sepolia].rpcUrl : chainsConfig[Chains.gnosis].rpcUrl,
  blockExplorerUrl: isTestnet
    ? chainsConfig[Chains.sepolia].blockExplorerUrls[0]
    : chainsConfig[Chains.gnosis].blockExplorerUrls[0],
}

const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const web3AuthOptions = {
  clientId: isTestnet ? WEB3_AUTH_CLIENT_ID_TESTNET : WEB3_AUTH_CLIENT_ID_PRODUCTION, // Client ID from Web3Auth Dashboard
  // authMode: 'WALLET', // Enables only social wallets
  chainConfig,
  uiConfig: {
    appName,
    logoLight: 'https://avatars.githubusercontent.com/u/109973181?s=201&v=4',
    logoDark: 'https://avatars.githubusercontent.com/u/109973181?s=201&v=4',
    modalZIndex: '13002', // Onboard modal is 13001
    defaultLanguage: LANGUAGES.en,
  },
  web3AuthNetwork: isTestnet ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider: ethereumPrivateKeyProvider,
}

export const web3AuthInstance: Web3Auth = !isGitHubActionBuild
  ? new Web3Auth(web3AuthOptions)
  : ({} as Web3Auth) // Hack to avoid errors on GitHub build

export default function web3AuthConnectorInstance() {
  return Web3AuthConnector({
    web3AuthInstance,
  })
}
