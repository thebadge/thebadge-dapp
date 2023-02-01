import axios from 'axios'

import { BackendResponse } from '@/types/utils'

type Args = {
  attributes: string
  filePaths?: string[]
}

export default async function ipfsUpload(
  metadata: Args,
): Promise<BackendResponse<{ ipfsHash: string; s3Url: string }>> {
  const res = await axios.post<BackendResponse<{ ipfsHash: string; s3Url: string }>>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ipfs/pin`,
    metadata,
  )

  return res.data
}
