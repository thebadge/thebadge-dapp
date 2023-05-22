import axios from 'axios'

import { BACKEND_URL } from '@/src/constants/common'
import { BackendResponse } from '@/types/utils'

/**
 * Retrieves data from the (IPFS) based on the given hash, using our own backend.
 * @async
 * @template T - The type of the content data to retrieve from IPFS.
 * @template X - Additional type parameter that can be optionally provided to extend the backend response type.
 * @param {string} hash - The IPFS hash representing the content to retrieve.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function getFromIPFS<T, X = {}>(hash: string) {
  const cleanedHash = hash.replace(/^ipfs?:\/\//, '')
  return axios.get<BackendResponse<{ content: T } & X>>(`${BACKEND_URL}/api/ipfs/${cleanedHash}`)
}
