import useSWR from 'swr'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { KlerosBadgeModelController__factory } from '@/types/generated/typechain'

/**
 * This hook calculates the cost of challenge a summiting badge or a removal for a badge based on the badge's status and
 * badge model ID. It uses other custom hooks, to fetch the necessary data and perform the cost calculations. It's going
 * to retun the RemovalChallengeCost or the SubmissionChallengeCost depending on the badge status.
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
