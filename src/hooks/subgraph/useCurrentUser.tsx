import { useUserById } from '@/src/hooks/subgraph/useUserById'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export const useCurrentUser = () => {
  const { address } = useWeb3Connection()

  return useUserById(address)
}
