import { useRouter } from 'next/router'

import { parseNetworkIdQuery, parsePrefixedAddress } from '@/src/utils/prefixedAddress'
import { ChainsValues } from '@/types/chains'

/**
 * Hook that returns the networkId from the query parameters or null if not found
 */
export default function useNetworkQueryParam(): ChainsValues | null {
  const router = useRouter()

  if (router.query.contract) {
    const { chainId } = parsePrefixedAddress(router.query.contract as string)
    return chainId
  }

  if (router.query.networkId) {
    return parseNetworkIdQuery(router.query.networkId as string)
  }

  return null
}
