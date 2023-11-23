import useSWR from 'swr'

import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TheBadgeUsers__factory } from '@/types/generated/typechain'

export default function useIsUserVerified(
  userAddress: `0x${string}` | undefined,
  controller: string,
) {
  const theBadgeUsers = useContractInstance(TheBadgeUsers__factory, 'TheBadgeUsers')
  const user = useUserById(userAddress)
  return useSWR(
    user.data?.id && userAddress?.length
      ? [`isUserVerified:${userAddress}-${controller}`, userAddress, controller]
      : null,
    ([, _address]) => theBadgeUsers.isUserVerified(_address, controller),
  )
}
