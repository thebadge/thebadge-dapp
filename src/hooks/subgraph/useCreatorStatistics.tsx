import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function useCreatorStatistics() {
  const { address, appChainId } = useWeb3Connection()

  const gql = useSubgraph()
  return useSWR(
    address ? [`creatorStatistics`, address, appChainId] : null,
    ([, _address]) => {
      return gql.creatorStatistics({ address: _address })
    },
    { revalidateOnMount: true },
  )
}
