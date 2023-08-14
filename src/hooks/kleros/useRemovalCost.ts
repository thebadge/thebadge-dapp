import useSWR from 'swr'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { KlerosBadgeModelController__factory } from '@/types/generated/typechain'

/**
 * This hook calculates the cost of creating a removal request of a badge that is already in a tcr list
 * @param badgeId
 */
export function useRemovalCost(badgeId: string) {
  const klerosBadgeModelController = useContractInstance(
    KlerosBadgeModelController__factory,
    'KlerosBadgeModelController',
  )

  return useSWR(
    [`removalDeposit:${badgeId}`, badgeId],
    ([,]) => klerosBadgeModelController.getRemovalDepositValue(badgeId),
    { revalidateOnMount: true },
  )
}
