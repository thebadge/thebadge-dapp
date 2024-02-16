import nullthrows from 'nullthrows'

import { ChainConfig, ChainsValues } from '@/types/chains'
import {
  ObjectValues,
  ProviderChains,
  RPCProviders,
  RPCProvidersENV,
  isGitHubActionBuild,
} from '@/types/utils'

export const Chains = {
  //mainnet: 1,
  goerli: 5,
  sepolia: 11155111,
  mumbai: 80001,
  polygon: 137,
  gnosis: 100,
} as const

export const ChainShortName = {
  mainnet: 'eth',
  polygon: 'matic',
  mumbai: 'mumbai-matic',
  goerli: 'gor',
  sepolia: 'sep',
  gnosis: 'gno',
}

export const ChainName = {
  [Chains.goerli]: 'goerli',
  [Chains.sepolia]: 'sepolia',
  [Chains.gnosis]: 'gnosis',
  [Chains.polygon]: 'matic',
  [Chains.mumbai]: 'mumbai',
}

export const ChainNameToIds = {
  [ChainName[Chains.goerli]]: Chains.goerli,
  [ChainName[Chains.sepolia]]: Chains.sepolia,
  [ChainName[Chains.gnosis]]: Chains.gnosis,
  [ChainName[Chains.polygon]]: Chains.polygon,
  [ChainName[Chains.mumbai]]: Chains.mumbai,
}

export const providerChains: ProviderChains = {
  [RPCProviders.infura]: {
    [Chains.goerli]: 'goerli',
    [Chains.sepolia]: 'sepolia',
    [Chains.gnosis]: 'gnosis',
    [Chains.polygon]: 'polygon-mainnet',
    [Chains.mumbai]: 'polygon-mumbai',
  },
  [RPCProviders.alchemy]: {
    [Chains.goerli]: 'eth-goerli',
    [Chains.sepolia]: 'eth-sepolia',
    [Chains.gnosis]: 'xDai-gnosis',
    [Chains.polygon]: 'polygon',
    [Chains.mumbai]: 'mumbai',
  },
}

export const getChainName = (chainId: ChainsValues) => ChainName[chainId]
export const getChainIdByName = (chainName: string) => ChainNameToIds[chainName]

export const TestnetChains = [Chains.goerli, Chains.sepolia, Chains.mumbai]
export const MainnetChains = [Chains.gnosis, Chains.polygon]

const getInfuraRPCUrl = (chainId: ChainsValues) =>
  `https://${providerChains[RPCProviders.infura][chainId]}.infura.io/v3/${
    process.env.NEXT_PUBLIC_INFURA_TOKEN
  }`

const getAlchemyRPCUrl = (chainId: ChainsValues) =>
  `https://${providerChains[RPCProviders.alchemy][chainId]}.g.alchemy.com/v2/${
    process.env.NEXT_PUBLIC_ALCHEMY_TOKEN
  }`

export const getProviderUrl = (
  chainId: ChainsValues,
  provider?: ObjectValues<typeof RPCProviders>,
) => {
  if (
    !RPCProvidersENV[RPCProviders.infura] &&
    !RPCProvidersENV[RPCProviders.alchemy] &&
    !isGitHubActionBuild
  ) {
    throw new Error(`You must set infura/alchemy token provider in environment variable`)
  }

  // Gnosis has its own rpc provider
  if (chainId === Chains.gnosis) {
    return 'https://gnosis.drpc.org'
  }
  //Manual provider
  if (provider === RPCProviders.infura && RPCProvidersENV[RPCProviders.infura])
    return getInfuraRPCUrl(chainId)

  if (provider === RPCProviders.alchemy && RPCProvidersENV[RPCProviders.alchemy])
    return getAlchemyRPCUrl(chainId)

  // Auto-magic provider
  if (isGitHubActionBuild) return `placeholder-token-${chainId}`
  if (RPCProvidersENV[RPCProviders.infura]) return getInfuraRPCUrl(chainId)
  if (RPCProvidersENV[RPCProviders.alchemy]) return getAlchemyRPCUrl(chainId)

  throw Error('Token provider could not be found')
}

// Default chain id from env var
export const INITIAL_APP_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || isGitHubActionBuild ? '5' : '42',
) as ChainsValues

export const WALLET_CONNECT_ID = Number(
  process.env.NEXT_PUBLIC_WALLET_CONNECT || isGitHubActionBuild
    ? 'test'
    : process.env.NEXT_PUBLIC_WALLET_CONNECT,
) as ChainsValues

export const chainsConfig: Record<ChainsValues, ChainConfig> = {
  [Chains.goerli]: {
    id: Chains.goerli,
    name: 'Görli Testnet',
    shortName: ChainShortName.goerli,
    chainId: Chains.goerli,
    chainIdHex: '0x5',
    rpcUrl: getProviderUrl(Chains.goerli),
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
    token: 'ETH',
  },
  [Chains.sepolia]: {
    id: Chains.sepolia,
    name: 'Ethereum Sepolia',
    shortName: ChainShortName.sepolia,
    chainId: Chains.sepolia,
    chainIdHex: '0xaa36a7',
    rpcUrl: getProviderUrl(Chains.sepolia),
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    token: 'ETH',
  },
  [Chains.gnosis]: {
    id: Chains.gnosis,
    name: 'Gnosis Chain',
    shortName: ChainShortName.gnosis,
    chainId: Chains.gnosis,
    chainIdHex: '0x64',
    rpcUrl: getProviderUrl(Chains.gnosis),
    blockExplorerUrls: ['https://gnosisscan.io/'],
    token: 'xDAI',
  },
  // [Chains.mainnet]: {
  //   id: Chains.mainnet,
  //   name: 'Mainnet',
  //   shortName: ChainShortName.mainnet,
  //   chainId: Chains.mainnet,
  //   chainIdHex: '0x1',
  //   rpcUrl: getProviderUrl(Chains.mainnet),
  //   blockExplorerUrls: ['https://etherscan.io/'],
  //   token: 'ETH',
  // },
  [Chains.polygon]: {
    id: Chains.polygon,
    name: 'Polygon',
    shortName: ChainShortName.polygon,
    chainId: Chains.polygon,
    chainIdHex: '0x89',
    rpcUrl: getProviderUrl(Chains.polygon),
    blockExplorerUrls: ['https://polygonscan.com/'],
    token: 'MATIC',
  },
  [Chains.mumbai]: {
    id: Chains.mumbai,
    name: 'Mumbai',
    shortName: ChainShortName.mumbai,
    chainId: Chains.mumbai,
    chainIdHex: '0x13881',
    rpcUrl: getProviderUrl(Chains.mumbai),
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    token: 'MATIC',
  },
}

export function getNetworkConfig(chainId: ChainsValues): ChainConfig {
  const networkConfig = chainsConfig[chainId]
  return nullthrows(networkConfig, `No config for chain id: ${chainId}`)
}

/**
 * @dev Here you can add the list of tokens you want to use in the app
 * The list follow the standard from: https://tokenlists.org/
 */
export const TokensLists = {
  '1INCH': 'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
  COINGECKO: 'https://tokens.coingecko.com/uniswap/all.json',
  OPTIMISM: 'https://static.optimism.io/optimism.tokenlist.json',
} as const
