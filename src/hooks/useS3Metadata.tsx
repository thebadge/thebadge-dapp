import useSWR from 'swr'

import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { cleanHash } from '@/src/utils/fileUtils'

/**
 * Hook that use useSWR with disabled revalidation to reduce the API usage. After fetching the hash data one, it won't
 * re-fetched twice after the user close the app, this should be fine, si it's a IFS File.
 * @param hash
 */
export default function useS3Metadata<T>(hash: string) {
  return useSWR(hash.length ? hash : null, async (_hash) => {
    const cleanedHash = cleanHash(_hash as string)

    const res = await getFromIPFS<T>(cleanedHash)
    return res.data.result
  })
}
