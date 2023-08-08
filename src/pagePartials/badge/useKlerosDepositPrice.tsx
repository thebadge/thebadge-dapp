import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import {
  KlerosBadgeModelController,
  KlerosBadgeModelController__factory,
} from '@/types/generated/typechain'

export default function useKlerosDepositPrice(badgeTypeId: string) {
  const klerosBadgeModelController = useContractInstance(
    KlerosBadgeModelController__factory,
    'KlerosBadgeModelController',
  )
  const calls = [klerosBadgeModelController.mintValue] as const
  const [{ data: klerosDepositCostData }] = useContractCall<
    KlerosBadgeModelController,
    typeof calls
  >(calls, [[badgeTypeId]], `klerosBadgeRequestValue-${badgeTypeId}`)

  return klerosDepositCostData?.[0]
}
