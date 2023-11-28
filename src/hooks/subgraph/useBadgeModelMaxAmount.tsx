import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useChainId from '@/src/hooks/theBadge/useChainId'
import { BadgeModel } from '@/types/generated/subgraph'

export default function useBadgeModelMaxAmount(first = 10) {
  const gql = useSubgraph()
  const chainId = useChainId()

  return useSWR([`BadgeModelsMaxAmount:${first}`, first, chainId], async ([, _first]) => {
    const response = await gql.communityBadgeModelsMaxAmount({ first: _first })

    return response.badgeModels as BadgeModel[]
  })
}
