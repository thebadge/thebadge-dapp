import shuffle from 'lodash/shuffle'
import useSWR from 'swr'

import { MainnetChains, TestnetChains } from '@/src/config/web3'
import useMultiSubgraph from '@/src/hooks/subgraph/useMultiSubgraph'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { isTestnet } from '@/src/utils/network'
import { BadgeModel } from '@/types/generated/subgraph'

/**
 * Fetch the first X from every chain
 * @param first
 */
export default function useBadgeModelMaxAmount(first = 10) {
  const chainIds = isTestnet ? TestnetChains : MainnetChains
  const multiSubgraph = useMultiSubgraph(SubgraphName.TheBadge, chainIds)

  return useSWR([`BadgeModelsMaxAmount:${first}`, first], async ([, _first]) => {
    const response = await Promise.all(
      multiSubgraph.map((gql) => gql.communityBadgeModelsMaxAmount({ first: _first })),
    )

    let badgeModels: BadgeModel[] = []

    // For each network we put all the badges into a simple array
    response.forEach((r) => {
      badgeModels = [...badgeModels, ...((r.badgeModels as BadgeModel[]) || [])]
    })

    return shuffle(badgeModels)
  })
}
