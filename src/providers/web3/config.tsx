import { injected, walletConnect } from '@wagmi/connectors'
import { cookieStorage, createConfig, createStorage } from 'wagmi'

import { APP_URL, WEB3_MODAL_PROJECT_ID, appName } from '@/src/constants/common'
import { DEFAULT_CHAINS, DEFAULT_TRANSPORTS } from '@/src/providers/web3/utils'
import web3AuthConnectorInstance from '@/src/providers/web3/web3AuthConfig'

// Get projectId at https://cloud.walletconnect.com
export const projectId = WEB3_MODAL_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: appName || '',
  description: 'The Badge DApp',
  url: APP_URL,
  icons: ['/favicon/favicon-32x32.png', '/favicon/favicon.svg'],
}

// Create wagmiConfig
export const wagmiConfig = createConfig({
  chains: DEFAULT_CHAINS,
  transports: DEFAULT_TRANSPORTS,
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    web3AuthConnectorInstance(),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})
