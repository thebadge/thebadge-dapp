import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useChainId from '@/src/hooks/theBadge/useChainId'

export default function useSubGraphStatus() {
  const gql = useSubgraph()
  const chainId = useChainId()
  return useSWR([`Status`, chainId], async () => {
    let subGraphErrors
    try {
      subGraphErrors = await gql.subgraphErrors()
    } catch (e) {
      return null
    }

    return subGraphErrors._meta
  })
}
