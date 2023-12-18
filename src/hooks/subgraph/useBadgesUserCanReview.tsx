import useSWR from 'swr'

import { nowInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { Badge } from '@/types/generated/subgraph'
import { WCAddress } from '@/types/utils'

const now = nowInSeconds()

export default function useBadgesUserCanReview({
  address,
  date,
}: {
  address: WCAddress | undefined
  date?: number
}) {
  const gql = useSubgraph()
  const { readOnlyChainId } = useWeb3Connection()

  return useSWR(
    address?.length ? [`BadgesUserCanReview:${address}`, address, date, readOnlyChainId] : null,
    async ([, _address, _date]) => {
      const response = await gql.badgesUserCanReview({
        userAddress: _address || '',
        date: _date || now,
      })

      return response.badges as Badge[]
    },
  )
}
