import useSWR from 'swr'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TheBadge__factory } from '@/types/generated/typechain'

/**
 * This hook calculates the cost of creating a challenge request
 * @param badgeId
 */
export function useChallengeCost(badgeId: string) {
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  return useSWR(
    [`challengeDeposit:${badgeId}`, badgeId],
    ([,]) => theBadge.getChallengeDepositValue(badgeId),
    { revalidateOnMount: true },
  )
}
