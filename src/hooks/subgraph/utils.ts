import axios, { AxiosError } from 'axios'
import DataLoader, { BatchLoadFn } from 'dataloader'
import { stableHash } from 'swr/_internal'

import { IPFS_URL } from '@/src/constants/common'
import { getCacheResponse, saveResponseOnCache } from '@/src/utils/cache'
import { cleanHash } from '@/src/utils/fileUtils'
import { BackendResponse } from '@/types/utils'

/**
 * This function takes an array of collapsed requests makes a batch call and return an array of responses
 * @param keys
 */
const fetcher: BatchLoadFn<string, BackendResponse<{ content: any } & any>> = async (ipsHashes) => {
  const url = `${IPFS_URL}/api/ipfs/retrieveBatchFromIpfs`
  const backendResponse = await axios.post<[BackendResponse<{ content: any } & any>]>(url, {
    ipsHashes,
  })
  return backendResponse.data
}

const IPFSLoader = new DataLoader(fetcher, {
  maxBatchSize: 10,
  batchScheduleFn: (callback) => setTimeout(callback, 50),
})

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
  // const etagCacheKey = `etag-${cleanedHash}`

  // Get cached item as long as 15min
  const cachedItem = getCacheResponse(itemCacheKey)
  if (cachedItem) {
    return cachedItem
  }
  try {
    // const etag = getCacheResponse(etagCacheKey, true)
    // const headers = etag ? { 'If-None-Match': etag } : {}
    const backendResponse: BackendResponse<{ content: T } & X> = await IPFSLoader.load(cleanedHash)
    // Check if it's a valid response or an error
    if (!backendResponse) {
      /* determine if the error should not be cached */
      IPFSLoader.clear(cleanedHash)
      return backendResponse
    }

    // If the response has something on it, we store it on cache
    saveResponseOnCache(itemCacheKey, backendResponse)
    // saveResponseOnCache(etagCacheKey, backendResponse.headers.etag)
    return backendResponse
  } catch (error) {
    // Handle 304 Not Modified response
    if ((error as AxiosError)?.response?.status === 304) {
      // Handle the case where the resource has not been modified
      const cachedItem = getCacheResponse(itemCacheKey, true)
      // Refresh expiration item on cache
      saveResponseOnCache(itemCacheKey, cachedItem)
      if (cachedItem) {
        return cachedItem
      }
    }

    // Handle other errors
    console.error('Error fetching from IPFS', error)
    throw error
  }
}

/**
 * Helpers functions that allows us to fetch items from ipfs on SSR
 * @param ipfsHash
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function ssrGetContentFromIPFS<T, X = {}>(ipfsHash: string) {
  const hash = ipfsHash.replace(/^ipfs?:\/\//, '').replace(/^ipfs\//, '')
  return fetch(`${IPFS_URL}/api/ipfs/${hash}`).then(async (response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK')
    }
    return response.json().then() as unknown as BackendResponse<{ content: T } & X>
  })
}

export function stringifyKey(key: Array<string | undefined | number>): string {
  // A stable hash implementation that supports:
  // - Fast and ensures unique hash properties
  // - Handles unserializable values
  // - Handles object key ordering
  // - Generates short results
  //
  // This is not a serialization function, and the result is not guaranteed to be
  // parsable.
  return stableHash(key)
}
