import useSWR from 'swr'

import useTBContract from '@/src/hooks/theBadge/useTBContract'

/**
 * This hook calculates the cost of creating a challenge request
 * @param badgeId
 */
export function useChallengeCost(badgeId: string) {
  const theBadge = useTBContract()

  return useSWR(
    [`challengeDeposit:${badgeId}`, badgeId],
    ([,]) => theBadge.getChallengeDepositValue(badgeId),
    { revalidateOnMount: true },
  )
}
