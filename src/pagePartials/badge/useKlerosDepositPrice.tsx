import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { KlerosController, KlerosController__factory } from '@/types/generated/typechain'

export default function useKlerosDepositPrice(badgeTypeId: string) {
  const klerosController = useContractInstance(KlerosController__factory, 'KlerosController')
  const calls = [klerosController.mintValue] as const
  const [{ data: klerosDepositCostData }] = useContractCall<KlerosController, typeof calls>(
    calls,
    [[badgeTypeId]],
    `klerosBadgeRequestValue-${badgeTypeId}`,
  )

  return klerosDepositCostData?.[0]
}
