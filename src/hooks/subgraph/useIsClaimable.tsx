import useSWR from 'swr'

import useTBContract from '@/src/hooks/theBadge/useTBContract'

export default function useIsClaimable(badgeId: string) {
  const theBadge = useTBContract()

  return useSWR([`isClaimable:${badgeId}`, badgeId], ([,]) => theBadge.isClaimable(badgeId), {
    revalidateOnMount: true,
  })
}
