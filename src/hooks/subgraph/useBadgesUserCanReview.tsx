import useSWR from 'swr'

import { nowInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useChainId from '@/src/hooks/theBadge/useChainId'
import { Badge } from '@/types/generated/subgraph'

const now = nowInSeconds()

export default function useBadgesUserCanReview({
  address,
  date,
}: {
  address: `0x${string}` | undefined
  date?: number
}) {
  const gql = useSubgraph()
  const chainId = useChainId()

  return useSWR(
    address?.length ? [`BadgesUserCanReview:${address}`, address, date, chainId] : null,
    async ([, _address, _date]) => {
      const response = await gql.badgesUserCanReview({
        userAddress: _address || '',
        date: _date || now,
      })

      return response.badges as Badge[]
    },
  )
}
