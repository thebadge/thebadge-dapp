import useSWR from 'swr'

import useTBStore from '@/src/hooks/theBadge/useTBStore'

export default function useCreateModelFeeValue() {
  const theBadgeStore = useTBStore()
  return useSWR(
    [`createBadgeModelProtocolFee`],
    () => theBadgeStore.createBadgeModelProtocolFee(),
    {
      revalidateOnMount: true,
    },
  )
}
