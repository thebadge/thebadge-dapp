import useSWR from 'swr'

import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TheBadgeUsers__factory } from '@/types/generated/typechain'

export default function useIsUserVerified(userAddress: string, controller: string) {
  const user = useUserById(userAddress)
  const theBadgeUsers = useContractInstance(TheBadgeUsers__factory, 'TheBadgeUsers')
  return useSWR(
    user.data?.id ? [`isUserVerified:${userAddress}-${controller}`, userAddress, controller] : null,
    ([, _userAddress, _controller]) => theBadgeUsers.isUserVerified(userAddress, controller),
  )
}
