import axios, { AxiosError, AxiosResponse } from 'axios'

import { BACKEND_URL } from '@/src/constants/common'
import { cleanHash } from '@/src/utils/fileUtils'
import { BackendResponse } from '@/types/utils'

/**
 * Retrieves data from the (IPFS) based on the given hash, using our own backend.
 * @async
 * @template T - The type of the content data to retrieve from IPFS.
 * @template X - Additional type parameter that can be optionally provided to extend the backend response type.
 * @param {string} hash - The IPFS hash representing the content to retrieve.
 */
export async function getFromIPFS<T, X = NonNullable<unknown>>(hash?: string): Promise<any> {
  if (!hash) return
  const cleanedHash = cleanHash(hash as string)
  if (!cleanedHash) {
    console.warn('Invalid hash provided on getFromIPFS', { hash })
    return
  }
  const itemCacheKey = cleanedHash
  const etagCacheKey = `etag-${cleanedHash}`
  const url = `${BACKEND_URL}/api/ipfs/${cleanedHash}`

  const cachedResponse = getCacheResponse<BackendResponse<{ content: T } & X>>(itemCacheKey)
  if (cachedResponse) {
    return cachedResponse
  }

  const etag = getCacheResponse(etagCacheKey)
  const headers = etag ? { 'If-None-Match': etag } : {}
  try {
    const backendResponse = await axios.get<BackendResponse<{ content: T } & X>>(url, {
      headers: headers as Record<string, string>,
    })
    if (!backendResponse.data) return backendResponse

    // If the response has something on it, we store it on cache
    saveResponseOnCache(itemCacheKey, backendResponse)
    saveResponseOnCache(etagCacheKey, backendResponse.headers.etag)
    return backendResponse
  } catch (error) {
    // Handle 304 Not Modified response
    if ((error as AxiosError)?.response?.status === 304) {
      // Handle the case where the resource has not been modified
      console.log('Resource not modified')
      return getCacheResponse(itemCacheKey)
    }

    // Handle other errors
    console.error('Error fetching from IPFS', error)
    throw error
  }
}

/**
 * Check if item exist on session storage, and if it's older than 15min or not
 * @param key
 */
function checkIfExistOnCache(key: string) {
  const item = sessionStorage.getItem(key)
  return !!item && Date.now() < JSON.parse(item).expirationTime
}

/**
 * Helper function to retrieve cache response from the local store, before call
 * it you should check if the cacheExist
 * @param key
 */
function getCacheResponse<T>(key: string) {
  if (checkIfExistOnCache(key)) {
    const item = JSON.parse(sessionStorage.getItem(key) as string)
    if ('response' in item) return item.response as AxiosResponse<T>
    else return null
  }
  return null
}

function saveResponseOnCache(key: string, response: any) {
  const FIFTEEN_MIN = 15 * 60 * 1000 /* ms */

  sessionStorage.setItem(
    key,
    JSON.stringify({ response, expirationTime: Date.now() + FIFTEEN_MIN }),
  )
}
