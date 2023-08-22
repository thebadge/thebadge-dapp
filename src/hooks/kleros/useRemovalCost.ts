import useSWR from 'swr'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TheBadge__factory } from '@/types/generated/typechain'

/**
 * This hook calculates the cost of creating a removal request of a badge that is already in a tcr list
 * @param badgeId
 */
export function useRemovalCost(badgeId: string) {
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  return useSWR(
    [`removalDeposit:${badgeId}`, badgeId],
    ([,]) => theBadge.getRemovalDepositValue(badgeId),
    { revalidateOnMount: true },
  )
}
