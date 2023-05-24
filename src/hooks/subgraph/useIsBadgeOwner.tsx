import useSWR from 'swr'

import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import isSameAddress from '@/src/utils/addressValidations'

export default function useIsBadgeOwner(badgeId: string, ownerAddress: string) {
  const gql = useSubgraph()
  return useSWR(badgeId.length ? [`isOwnerBadge:${badgeId}`, ownerAddress] : null, async ([,]) => {
    const badgeResponse = await gql.badgeById({ id: badgeId })
    const badge = badgeResponse.badge
    return isSameAddress(badge?.account.id, ownerAddress)
  })
}
