import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

interface UseIsCreatorInterface {
  isCreator: () => Promise<boolean>
}

export default function useIsCreator(address?: string): UseIsCreatorInterface {
  const gql = useSubgraph()
  const { address: connectedAddress } = useWeb3Connection()

  const isCreator = async () => {
    const userById = await gql.userById({ id: address || connectedAddress || '' })
    return !!userById.user?.isCreator
  }

  return {
    isCreator,
  }
}
