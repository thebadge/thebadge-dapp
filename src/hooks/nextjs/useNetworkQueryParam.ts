import { useParams } from 'next/navigation'

import { parseNetworkIdQuery, parsePrefixedAddress } from '@/src/utils/prefixedAddress'
import { ChainsValues } from '@/types/chains'

/**
 * Hook that returns the networkId from the query parameters or null if not found
 */
export default function useNetworkQueryParam(): ChainsValues | null {
  const params = useParams()

  if (params?.contract) {
    const { chainId } = parsePrefixedAddress(params?.contract as string)
    return chainId
  }

  if (params?.networkId) {
    return parseNetworkIdQuery(params?.networkId as string)
  }

  return null
}
