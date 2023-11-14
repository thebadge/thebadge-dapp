import { useCallback, useMemo, useState } from 'react'

import { ListFilter } from '@/src/components/helpers/FilteredList'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function useSelectedFilters({
  filters,
  listId,
}: {
  listId: string | undefined
  filters: Array<ListFilter>
}) {
  const { address } = useWeb3Connection()
  const defaultSelectedFilters = useMemo(() => filters.filter((f) => f.defaultSelected), [filters])
  const [selectedFilters, setSelected] = useState<ListFilter[]>(
    getStoredColumnVisibility(listId, address) || defaultSelectedFilters,
  )

  const setSelectedFilters = useCallback(
    (value: ListFilter[]) => {
      setSelected(value)
      if (!listId) return
      // Each time that the provider change the column visibility config, we store it locally
      localStorage.setItem(`${listId}-selectedFilters-${address}`, JSON.stringify(value))
    },
    [address, listId],
  )

  return { selectedFilters, setSelectedFilters }
}

function getStoredColumnVisibility(
  listId: string | undefined,
  address: string | undefined,
): ListFilter[] | null {
  if (!listId) return null
  const stored = localStorage.getItem(`${listId}-selectedFilters-${address ?? ''}`)
  if (stored) return JSON.parse(stored) as ListFilter[]
  return null
}
