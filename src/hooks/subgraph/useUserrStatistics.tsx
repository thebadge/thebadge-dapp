import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function useUserStatistics() {
  const { address, appChainId } = useWeb3Connection()

  const gql = useSubgraph()
  return useSWR(address ? [`userStatistics`, address, appChainId] : null, ([, _address]) => {
    return gql.userStatistics({ address: _address })
  })
}
