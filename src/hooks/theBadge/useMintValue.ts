import useSWR from 'swr'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TheBadge__factory } from '@/types/generated/typechain'

export default function useMintValue(badgeModelId: string) {
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  return useSWR([`badgeMintValue:${badgeModelId}`, badgeModelId], ([, _badgeModelId]) =>
    theBadge.mintValue(_badgeModelId),
  )
}
