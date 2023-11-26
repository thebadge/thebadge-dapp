import useSWR from 'swr'

import useTBContract from '@/src/hooks/theBadge/useTBContract'

/**
 * This hook calculates the cost of creating a removal request of a badge that is already in a tcr list
 * @param badgeId
 */
export function useRemovalCost(badgeId: string) {
  const theBadge = useTBContract()

  return useSWR(
    [`removalDeposit:${badgeId}`, badgeId],
    ([,]) => theBadge.getRemovalDepositValue(badgeId),
    { revalidateOnMount: true },
  )
}
