import useSWR from 'swr'

import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { BadgeEvidenceMetadata } from '@/types/badges/BadgeMetadata'
import { KlerosBadgeRequest, KlerosRequestType } from '@/types/generated/subgraph'

/**
 * The BadgeKlerosMetadata provides additional information about a Badge within the Kleros system.
 * @param badgeId
 * @param targetContract
 * @param options
 * @return SWRResponse<BadgeKlerosMetaData>
 */
export function useBadgeKlerosMetadata(
  badgeId: string,
  targetContract?: string,
  options?: BadgeModelHooksOptions,
) {
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeId.length
  const gql = useSubgraph(SubgraphName.TheBadge, targetContract)

  return useSWR(fetchIt ? [`BadgeKlerosMetadata:${badgeId}`, badgeId] : null, async ([, _id]) => {
    const badgeKleros = await gql.badgeKlerosMetadataById({ id: _id })

    return badgeKleros.badgeKlerosMetaData
  })
}

/**
 * Returns the request evidence for the given Badge within the Kleros system. Returns the URL and the
 * Evidence as an object.
 * @param badgeId
 * @param options
 */
export function useEvidenceBadgeKlerosMetadata(badgeId: string, options?: BadgeModelHooksOptions) {
  const { readOnlyChainId } = useWeb3Connection()
  const badge = useBadgeById(badgeId)
  const badgeKlerosMetadata = useBadgeKlerosMetadata(badgeId, badge.data?.contractAddress, options)
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeId.length
  return useSWR(
    fetchIt
      ? [`EvidenceBadgeKlerosMetadata:${badgeId}`, badgeId, badge.data?.id, readOnlyChainId]
      : null,
    async () => {
      if (!badgeKlerosMetadata.data?.requests) {
        throw 'There was not possible to get the needed metadata. Try again in some minutes.'
      }

      const registrationRequest = badgeKlerosMetadata.data.requests.find(
        (r) => r.type === KlerosRequestType.Registration,
      )
      const registrationEvidence = registrationRequest?.evidences.find(
        (e) => e.sender === badge.data?.account.id,
      )

      const res = await getFromIPFS<BadgeEvidenceMetadata, { s3Url: string }>(
        registrationEvidence?.uri,
      )

      const requestBadgeEvidence = res ? res.data.result?.content : null
      const requestBadgeEvidenceRawUrl = res ? res.data.result?.s3Url : null

      return {
        ...badgeKlerosMetadata.data,
        requestBadgeEvidence,
        requestBadgeEvidenceRawUrl,
      }
    },
    {
      refreshInterval: (data) => {
        const activeRequest = data?.requests[data?.requests.length - 1] as KlerosBadgeRequest

        if (activeRequest.disputeID) return 0 // Stop refreshing
        return 5000 // If there is no disputeID re-try in 5sec
      },
    },
  )
}
