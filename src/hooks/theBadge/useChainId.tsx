const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function useChainId() {
  const { appChainId } = useWeb3Connection()

  return appChainId
}
