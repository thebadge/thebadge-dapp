import { useCallback, useState } from 'react'

// number alias to prevent confusions
export type ActionObserver = number

/**
 * Observer to listen the "watch" variable to trigger an action when the trigger
 * function is called in another place
 */
export default function useActionObserver(): { watch: ActionObserver; trigger: VoidFunction } {
  const [watch, setWatchCounter] = useState<ActionObserver>(0)

  const trigger = useCallback(() => setWatchCounter((prev) => prev + 1), [])

  return { watch, trigger }
}
