import useSWR from 'swr'

import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { KlerosController__factory } from '@/types/generated/typechain'

/**
 * This hook calculates the cost of challenge a summiting badge or a removal for a badge based on the badge's status and
 * badge model ID. It uses other custom hooks, to fetch the necessary data and perform the cost calculations. It's going
 * to retun the RemovalChallengeCost or the SubmissionChallengeCost depending on the badge status.
 * @param badgeId
 */
export function useChallengeCost(badgeId: string) {
  const badge = useBadgeById(badgeId)

  const klerosController = useContractInstance(KlerosController__factory, 'KlerosController')

  return useSWR(
    [`challengeDeposit:${badgeId}:${badge.data?.status}`, badgeId, badge.data?.status],
    ([,]) => klerosController.getChallengeValue(badgeId),
  )
}
