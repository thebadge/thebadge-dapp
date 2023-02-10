import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import {
  KlerosBadgeTypeController,
  KlerosBadgeTypeController__factory,
} from '@/types/generated/typechain'

export default function useKlerosDepositPrice(badgeTypeId: string) {
  const klerosController = useContractInstance(
    KlerosBadgeTypeController__factory,
    'KlerosBadgeTypeController',
  )
  const calls = [klerosController.badgeRequestValue] as const
  const [{ data: klerosDepositCostData }] = useContractCall<
    KlerosBadgeTypeController,
    typeof calls
  >(calls, [[badgeTypeId]], `klerosBadgeRequestValue-${badgeTypeId}`)

  return klerosDepositCostData?.[0]
}
