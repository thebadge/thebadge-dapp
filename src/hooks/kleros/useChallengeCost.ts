import useSWR from 'swr'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { KlerosBadgeModelController__factory } from '@/types/generated/typechain'

/**
 * This hook calculates the cost of creating a challenge request
 * @param badgeId
 */
export function useChallengeCost(badgeId: string) {
  const klerosBadgeModelController = useContractInstance(
    KlerosBadgeModelController__factory,
    'KlerosBadgeModelController',
  )

  return useSWR(
    [`challengeDeposit:${badgeId}`, badgeId],
    ([,]) => klerosBadgeModelController.getChallengeDepositValue(badgeId),
    { revalidateOnMount: true },
  )
}
