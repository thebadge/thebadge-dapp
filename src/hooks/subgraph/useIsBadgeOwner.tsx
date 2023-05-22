import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'

export default function useIsBadgeOwner(badgeId: string, ownerAddress: string) {
  const gql = useSubgraph()
  return useSWR(badgeId.length ? [`isOwnerBadge:${badgeId}`, ownerAddress] : null, async ([,]) => {
    const badgeResponse = await gql.badgeById({ id: badgeId })
    const badge = badgeResponse.badge
    return badge?.account.id === ownerAddress
  })
}
