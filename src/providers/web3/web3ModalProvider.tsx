import React, { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Web3Auth } from '@web3auth/modal'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { gnosis, sepolia } from 'viem/chains'
import { State, WagmiProvider } from 'wagmi'

import { projectId, wagmiConfig } from './config'
import { TERMS_AND_CONDITIONS_URL } from '@/src/constants/common'
import { isTestnet } from '@/src/utils/network'

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

// Select supported wallets (wallets that are displayed first)
const featuredWalletIds = [
  // Safe
  '225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f',
  // Core Avalanche friendly wallet,
  'f323633c1f67055a45aac84e321af6ffe46322da677ffdd32f9bc1e33bafe29c',
]

// Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  featuredWalletIds,
  termsConditionsUrl: TERMS_AND_CONDITIONS_URL,
  defaultChain: isTestnet ? sepolia : gnosis,
})

export const web3AuthInstance: Web3Auth | null = null

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: State
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
