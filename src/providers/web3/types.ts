import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { Web3Auth } from '@web3auth/modal'

import { ChainsValues } from '@/types/chains'
import { WCAddress } from '@/types/utils'

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
  selectedNetworkId: ChainsValues | undefined
  readOnlyChainId: ChainsValues
  getExplorerUrl: (hash: string) => string
  readOnlyAppProvider: JsonRpcProvider

  consoleAppConfig: VoidFunction
  web3Auth: Web3Auth | null
  getSocialCompressedPubKey: () => Promise<string | undefined>
  ethersSigner: JsonRpcProvider | JsonRpcSigner
}