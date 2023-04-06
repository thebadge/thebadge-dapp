import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'

export default function useIsBadgeOwner(typeId: string, ownerAddress: string) {
  const gql = useSubgraph()
  const badgeId = `${ownerAddress}-${typeId}`
  return useSWR(badgeId.length ? `isOwnerBadge:${badgeId}` : null, async (_badgeId: string) => {
    const badgeResponse = await gql.badgeById({ id: badgeId })
    const badge = badgeResponse.badge
    return !!badge
  })
}
