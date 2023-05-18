import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { BadgeMetadata, BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse, BackendResponse } from '@/types/utils'

/**
 * Hooks to wrap the getBadgeById graphql query, to take advantage of the SWR cache
 * and reduce the number of queries and also reduce the repeated code
 * @param badgeId
 */
export default function useBadgeById(badgeId: string) {
  const gql = useSubgraph()

  return useSWR(badgeId.length ? `Badge:${badgeId}` : null, async (_badgeId: string) => {
    const badgeResponse = await gql.badgeById({ id: badgeId })

    const badge = badgeResponse.badge
    const badgeModel = badge?.badgeModel

    if (!badge?.uri || !badgeModel?.uri) {
      throw 'There was not possible to get the needed metadata. Try again in some minutes.'
    }

    // TODO Add it when there is something in return
    const cleanedBadgeMetadataHash = badge?.uri.replace(/^ipfs?:\/\//, '')
    const cleanedModelMetadataHash = badgeModel?.uri.replace(/^ipfs?:\/\//, '')

    const res = await Promise.all([
      axios.get<BackendResponse<{ content: BadgeMetadata }>>(
        `${BACKEND_URL}/api/ipfs/${cleanedModelMetadataHash}`,
      ),
      axios.get<BackendResponse<BackendFileResponse & { content: BadgeModelMetadata }>>(
        `${BACKEND_URL}/api/ipfs/${cleanedModelMetadataHash}`,
      ),
    ])
    if (!res[0].data.result || !res[1].data.result) {
      throw 'There was not possible to get the needed metadata. Try again in some minutes.'
    }

    const badgeMetadata = res[0].data.result?.content
    const badgeModelMetadata = res[1].data.result?.content

    return {
      badge: {
        ...badge,
        badgeModel: {
          ...badge.badgeModel,
          badgeModelMetadata,
        },
      },
      badgeMetadata,
    }
  })
}
