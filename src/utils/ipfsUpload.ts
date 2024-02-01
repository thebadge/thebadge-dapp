import axios from 'axios'

import { IPFS_URL } from '@/src/constants/common'
import { BackendResponse } from '@/types/utils'

type Args<T = Record<string, unknown>> = {
  attributes: T
  filePaths?: string[]
  needKlerosPath?: boolean
}

export default async function ipfsUpload<T>(
  metadata: Args<T>,
): Promise<BackendResponse<{ ipfsHash: string; s3Url: string }>> {
  const res = await axios.post<BackendResponse<{ ipfsHash: string; s3Url: string }>>(
    `${IPFS_URL}/api/ipfs/pin`,
    metadata,
  )

  return res.data
}
