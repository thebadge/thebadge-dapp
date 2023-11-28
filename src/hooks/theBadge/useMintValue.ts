import useSWR from 'swr'

import useTBContract from '@/src/hooks/theBadge/useTBContract'

export default function useMintValue(badgeModelId: string) {
  const theBadge = useTBContract()
  return useSWR([`badgeMintValue:${badgeModelId}`, badgeModelId], ([, _badgeModelId]) =>
    theBadge.mintValue(_badgeModelId),
  )
}
