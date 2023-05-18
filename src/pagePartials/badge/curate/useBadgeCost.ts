import { BigNumberish } from 'ethers'

import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { KlerosController, KlerosController__factory } from '@/types/generated/typechain'

export function useBadgeCost(badgeId: BigNumberish) {
  const klerosController = useContractInstance(KlerosController__factory, 'KlerosController')
  const calls = [klerosController.getChallengeValue] as const
  const [{ data }] = useContractCall<KlerosController, typeof calls>(
    calls,
    [[badgeId]],
    `klerosGetChallengeValue-${badgeId}`,
  )

  return data?.[0]
}
