import { BigNumberish } from 'ethers'

import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import {
  KlerosBadgeTypeController,
  KlerosBadgeTypeController__factory,
} from '@/types/generated/typechain'

export function useBadgeCost(badgeId: BigNumberish, wallet: string) {
  const klerosController = useContractInstance(
    KlerosBadgeTypeController__factory,
    'KlerosBadgeTypeController',
  )
  const calls = [klerosController.getChallengeValue] as const
  const [{ data }] = useContractCall<KlerosBadgeTypeController, typeof calls>(
    calls,
    [[badgeId, wallet]],
    `klerosGetChallengeValue-${badgeId}-${wallet}`,
  )

  return data?.[0]
}
