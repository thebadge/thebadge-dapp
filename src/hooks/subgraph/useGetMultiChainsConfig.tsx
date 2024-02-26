import { MainnetChains, TestnetChains } from '@/src/config/web3'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function useGetMultiChainsConfig() {
  const { readOnlyChainId } = useWeb3Connection()
  const isTestnetBased = TestnetChains.includes(readOnlyChainId)
  const chainIds = isTestnetBased ? TestnetChains : MainnetChains
  return { isTestnetBased, chainIds }
}
