import { AxiosResponse } from 'axios'

/**
 * Helper function to retrieve cache response from the local store, before call
 * it you should check if the cacheExist
 * @param key
 * @param ignoreExpiration useful when we have e-tags
 */
export function getCacheResponse<T>(key: string, ignoreExpiration = false) {
  if (checkIfExistOnCache(key) || ignoreExpiration) {
    const item = JSON.parse(sessionStorage.getItem(key) as string)
    if (item && 'response' in item) return item.response as AxiosResponse<T>
    else return null
  }
  return null
}

export function saveResponseOnCache(key: string, response: any) {
  const FIFTEEN_MIN = 15 * 60 * 1000 /* ms */

  sessionStorage.setItem(
    key,
    JSON.stringify({ response, expirationTime: Date.now() + FIFTEEN_MIN }),
  )
}

/**
 * Check if item exist on session storage, and if it's older than 15min or not
 * @param key
 */
export function checkIfExistOnCache(key: string) {
  const item = sessionStorage.getItem(key)
  return !!item && Date.now() < JSON.parse(item).expirationTime
}
