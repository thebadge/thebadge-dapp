import useSWR from 'swr'

import useTBStore from '@/src/hooks/theBadge/useTBStore'

export default function useEstimateBadgeId() {
  const theBadgeStore = useTBStore()
  return useSWR([`estimatedBadgeId`], () => theBadgeStore.getCurrentBadgeIdCounter())
}
