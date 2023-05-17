import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import { BackendResponse } from '@/types/utils'

/**
 * Hook that use useSWR with disabled revalidation to reduce the API usage. After fetching the hash data one, it won't
 * re-fetched twice after the user close the app, this should be fine, si it's a IFS File.
 * @param hash
 */
export default function useS3Metadata<T>(hash: string) {
  return useSWR(hash.length ? hash : null, async (_hash) => {
    const cleanedHash = (_hash as string).replace(/^ipfs?:\/\//, '')

    const res = await axios.get<BackendResponse<T>>(`${BACKEND_URL}/api/ipfs/${cleanedHash}`)
    return res.data.result
  })
}
