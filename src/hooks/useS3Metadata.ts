import axios from 'axios'
import useSWR from 'swr'

import { BackendResponse } from '@/types/utils'

export default function useS3Metadata<T>(hash: string) {
  return useSWR(hash.length ? hash : null, async (_hash) => {
    const cleanedHash = (_hash as string).replace(/^ipfs?:\/\//, '')

    const res = await axios.get<BackendResponse<T>>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ipfs/${cleanedHash}`,
    )
    return res.data.result
  })
}
