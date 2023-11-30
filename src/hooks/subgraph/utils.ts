import axios, { AxiosResponse } from 'axios'

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
// eslint-disable-next-line @typescript-eslint/ban-types
export async function getFromIPFS<T, X = {}>(hash?: string) {
  if (!hash) return
  const cleanedHash = cleanHash(hash as string)
  if (!cleanedHash) {
    console.warn('Invalid hash provided on getFromIPFS', { hash })
    return
  }

  const cachedResponse = getCacheResponse<BackendResponse<{ content: T } & X>>(
    `${BACKEND_URL}/api/ipfs/${cleanedHash}`,
  )
  if (cachedResponse) return cachedResponse

  const backendResponse = await axios.get<BackendResponse<{ content: T } & X>>(
    `${BACKEND_URL}/api/ipfs/${cleanedHash}`,
  )
  if (!backendResponse.data) return backendResponse

  // If the response has something on it, we store it on cache
  saveResponseOnCache(`${BACKEND_URL}/api/ipfs/${cleanedHash}`, backendResponse)
  return backendResponse
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

/**
 * Helpers functions that allows us to fetch items from ipfs on SSR
 * @param ipfsHash
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function ssrGetContentFromIPFS<T, X = {}>(ipfsHash: string) {
  const hash = ipfsHash.replace(/^ipfs?:\/\//, '').replace(/^ipfs\//, '')
  return fetch(`${BACKEND_URL}/api/ipfs/${hash}`).then(async (response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK')
    }
    return response.json().then() as unknown as BackendResponse<{ content: T } & X>
  })
}
