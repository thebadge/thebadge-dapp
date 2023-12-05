import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function useSubGraphStatus() {
  const gql = useSubgraph()
  const { readOnlyChainId } = useWeb3Connection()
  return useSWR([`Status`, readOnlyChainId], async () => {
    let subGraphErrors
    try {
      subGraphErrors = await gql.subgraphErrors()
    } catch (e) {
      return null
    }

    return subGraphErrors._meta
  })
}
