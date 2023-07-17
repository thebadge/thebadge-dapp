import { useBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TCR__factory } from '@/types/generated/typechain'

export default function useTCRContractInstance(badgeModelId: string) {
  const badgeModel = useBadgeModelKlerosMetadata(badgeModelId)
  return useContractInstance(TCR__factory, 'TCR', badgeModel.data?.tcrList)
}
