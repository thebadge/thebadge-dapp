import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import { BackendResponse } from '@/types/utils'

export default function useS3Metadata<T>(hash: string) {
  return useSWR(hash.length ? hash : null, async (_hash) => {
    console.log(`Loading backend URL...: ${BACKEND_URL}`)
    const cleanedHash = (_hash as string).replace(/^ipfs?:\/\//, '')
    const requestUrl = `${BACKEND_URL}/api/ipfs/${cleanedHash}`
    console.log(`Requesting to s3Metadata to url: `, requestUrl)
    const res = await axios.get<BackendResponse<T>>(requestUrl)
    return res.data.result
  })
}
