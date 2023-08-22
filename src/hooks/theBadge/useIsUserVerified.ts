import useSWR from 'swr'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TheBadge__factory } from '@/types/generated/typechain'

export default function useIsUserVerified(userAddress: string, controller: string) {
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')
  return useSWR(
    [`isUserVerified:${userAddress}-${controller}`, userAddress, controller],
    ([, userAddress, controller]) => theBadge.isUserVerified(userAddress, controller),
  )
}
