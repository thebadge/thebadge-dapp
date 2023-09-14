import { useCallback, useEffect, useMemo, useState } from 'react'

import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export type StatisticVisibility = { [key: string]: boolean }

/**
 * Hooks that takes care of store and handle the column visibility, based on a category.
 * category must be unique for each statistic if you don't want to share stored visibility
 * @param category key to store the user configs
 * @param defaultVisibility is used when there is no stored config
 */
export default function useStatisticVisibility(
  category: string,
  defaultVisibility: StatisticVisibility,
) {
  const { address } = useWeb3Connection()
  const [stack, setStack] = useState<string[]>([])
  const [statisticVisibility, setStatisticVisibility] = useState<StatisticVisibility>(
    getStoredStatisticVisibility(category, address) || defaultVisibility,
  )

  useEffect(() => {
    if (stack.length === 0) {
      // Fulfill helper stack to keep just 2 items select
      Object.keys(statisticVisibility).map((keyName) => {
        if (statisticVisibility[keyName]) setStack((prevState) => [keyName, ...prevState])
      })
    }
  }, [stack.length, statisticVisibility])

  const toggleStatisticVisibility = useCallback(
    (columnName: string) => {
      // If the column toggle is on the stack, we ignore it
      if (stack.includes(columnName)) return

      // If we already have 2 select items, we want to deselect one
      const deselectColumn = stack.length === 2 ? stack.pop() : ''

      setStatisticVisibility((prev) => {
        const newValue = {
          ...prev,
          ...(deselectColumn && { [deselectColumn]: !prev[deselectColumn] }),
          [columnName]: !prev[columnName],
        }
        // TODO Swap it to localstorage later, we want it to be clean start btw each test
        sessionStorage.setItem(
          `${category}-statisticVisibility-${address}`,
          JSON.stringify(newValue),
        )
        return newValue
      })
      setStack(() => [columnName, ...stack])
    },
    [address, category, stack],
  )

  return useMemo(
    () => ({
      statisticVisibility,
      toggleStatisticVisibility,
    }),
    [statisticVisibility, toggleStatisticVisibility],
  )
}

function getStoredStatisticVisibility(
  category: string,
  address: string | null,
): StatisticVisibility | null {
  if (!address) return null
  const stored = sessionStorage.getItem(`${category}-statisticVisibility-${address}`)
  if (stored) return JSON.parse(stored) as StatisticVisibility
  return null
}
