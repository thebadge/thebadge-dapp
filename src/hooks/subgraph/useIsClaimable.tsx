import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { isBeforeToday } from '@/src/utils/dateUtils'
import { BadgeStatus } from '@/types/generated/subgraph'

export default function useIsClaimable(badgeId: string) {
  const badge = useBadgeById(badgeId)

  return (
    badge.data?.status === BadgeStatus.Requested &&
    isBeforeToday(badge.data.badgeKlerosMetaData?.reviewDueDate)
  )
}
