import useSWR from 'swr'

import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { TheBadgeUsers__factory } from '@/types/generated/typechain'
import { WCAddress } from '@/types/utils'

export default function useIsUserVerified(userAddress: WCAddress | undefined, controller: string) {
  const user = useUserById(userAddress)
  const theBadgeUsers = useContractInstance(TheBadgeUsers__factory, 'TheBadgeUsers')
  return useSWR(
    user.data?.id && userAddress?.length
      ? [`isUserVerified:${userAddress}-${controller}`, userAddress, controller]
      : null,
    async ([, _address]) => {
      try {
        const isVerified = await theBadgeUsers.isUserVerified(_address, controller)
        return isVerified
      } catch (e) {
        console.warn('[TheBadge] - isUserVerified', e)
        return false
      }
    },
  )
}
