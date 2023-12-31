import { useCallback } from 'react'

import { useSWRConfig } from 'swr'

import { stringifyKey } from '@/src/hooks/subgraph/utils'

type saveOnCacheFn = (key: Array<string | undefined> | string, data: any) => void

export default function useSWRCacheUtils() {
  const { cache } = useSWRConfig()

  const saveOnCache: saveOnCacheFn = useCallback(
    (key: Array<string | undefined> | string, data: any) => {
      const cacheKey = typeof key === 'string' ? key : stringifyKey(key)
      cache.set(cacheKey, {
        data,
      })
    },
    [cache],
  )

  const saveOnCacheIfMissing: saveOnCacheFn = useCallback(
    (key: Array<string | undefined> | string, data: any) => {
      const cacheKey = typeof key === 'string' ? key : stringifyKey(key)
      const alreadyExist = Boolean(cache.get(cacheKey))
      if (!alreadyExist) {
        cache.set(cacheKey, {
          data,
        })
      }
    },
    [cache],
  )

  return { saveOnCache, saveOnCacheIfMissing }
}
