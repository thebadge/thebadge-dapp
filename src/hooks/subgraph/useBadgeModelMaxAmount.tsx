import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { BadgeModel } from '@/types/generated/subgraph'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

export default function useBadgeModelMaxAmount(first = 10) {
  const gql = useSubgraph()
  const { readOnlyChainId } = useWeb3Connection()

  return useSWR([`BadgeModelsMaxAmount:${first}`, first, readOnlyChainId], async ([, _first]) => {
    const response = await gql.communityBadgeModelsMaxAmount({ first: _first })

    return response.badgeModels as BadgeModel[]
  })
}
