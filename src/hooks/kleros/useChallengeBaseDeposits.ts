import useSWR from 'swr'

import useTCRContractInstance from '@/src/hooks/kleros/useTCRContractInstance'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { BadgeStatus } from '@/types/generated/subgraph'

export function useSubmissionChallengeBaseDeposit(
  badgeModelId?: string,
  options?: { skip?: boolean },
) {
  const tcrContractInstance = useTCRContractInstance(badgeModelId as string)
  const shouldFetch = !options?.skip && badgeModelId
  return useSWR(
    shouldFetch ? [`submissionChallengeBaseDeposit:${badgeModelId}`, badgeModelId] : null,
    ([,]) => tcrContractInstance.submissionChallengeBaseDeposit(),
  )
}

export function useRemovalChallengeBaseDeposit(
  badgeModelId?: string,
  options?: { skip?: boolean },
) {
  const tcrContractInstance = useTCRContractInstance(badgeModelId as string)
  const shouldFetch = !options?.skip && badgeModelId
  return useSWR(
    shouldFetch ? [`removalChallengeBaseDeposit:${badgeModelId}`, badgeModelId] : null,
    ([,]) => tcrContractInstance.removalChallengeBaseDeposit(),
  )
}

/**
 * This hook calculates the cost of challenge a summiting badge or a removal for a badge based on the badge's status and
 * badge model ID. It uses other custom hooks, to fetch the necessary data and perform the cost calculations. It's going
 * to retun the RemovalChallengeCost or the SubmissionChallengeCost depending on the badge status.
 * @param badgeId
 */
export function useChallengeCost(badgeId: string) {
  const badge = useBadgeById(badgeId)
  const badgeModelId = badge.data?.badgeModel.id

  const challengeForRemovalCost = useRemovalChallengeBaseDeposit(badgeModelId, {
    skip:
      badge.data?.status !== BadgeStatus.Approved &&
      badge.data?.status !== BadgeStatus.RequestRemoval,
  })

  const challengeSubmitCost = useSubmissionChallengeBaseDeposit(badgeModelId, {
    skip: badge.data?.status !== BadgeStatus.Requested,
  })

  return challengeSubmitCost || challengeForRemovalCost
}
