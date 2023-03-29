import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { BadgeMetadata, BadgeTypeMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse, BackendResponse } from '@/types/utils'

/**
 * Hooks to wrap the getBadgeById graphql query, to take advantage of the SWR cache
 * and reduce the number of queries and also reduce the repeated code
 * @param typeId
 * @param ownerAddress
 */
export default function useBadgeById(typeId: string, ownerAddress: string) {
  const { appChainId } = useWeb3Connection()
  const badgeId = `${ownerAddress}-${typeId}`

  return useSWR(badgeId.length ? `Badge:${badgeId}` : null, async (_badgeId: string) => {
    const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
    const badgeResponse = await gql.badgeById({ id: badgeId })

    const badge = badgeResponse.badge
    const badgeType = badge?.badgeType

    if (!badgeType?.metadataURL || !badge?.evidenceMetadataUrl) {
      throw 'There was not possible to get the needed metadata. Try again in some minutes.'
    }

    const cleanedMetadataHash = badgeType?.metadataURL.replace(/^ipfs?:\/\//, '')
    const cleanedEvidenceHash = badge?.evidenceMetadataUrl.replace(/^ipfs?:\/\//, '')

    const res = await Promise.all([
      axios.get<BackendResponse<{ content: BadgeTypeMetadata }>>(
        `${BACKEND_URL}/api/ipfs/${cleanedMetadataHash}`,
      ),
      axios.get<BackendResponse<BackendFileResponse & { content: BadgeMetadata }>>(
        `${BACKEND_URL}/api/ipfs/${cleanedEvidenceHash}`,
      ),
    ])
    if (!res[0].data.result || !res[1].data.result) {
      throw 'There was not possible to get the needed metadata. Try again in some minutes.'
    }

    const badgeMetadata = res[0].data.result?.content
    const badgeEvidence = res[1].data.result?.content
    const rawBadgeEvidenceUrl = 's3Url' in res[1].data.result ? res[1].data.result?.s3Url : ''

    return {
      badge,
      badgeMetadata,
      badgeEvidence,
      rawBadgeEvidenceUrl,
    }
  })
}
