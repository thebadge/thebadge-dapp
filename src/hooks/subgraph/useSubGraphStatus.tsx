import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'

export default function useSubGraphStatus() {
  const gql = useSubgraph()

  return useSWR(`Status`, async () => {
    let subGraphErrors
    try {
      subGraphErrors = await gql.subgraphErrors()
    } catch (e) {
      return null
    }

    return subGraphErrors._meta
  })
}
