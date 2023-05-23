import useSWR from 'swr'

import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { BadgeEvidenceMetadata } from '@/types/badges/BadgeMetadata'
import { KlerosRequestType } from '@/types/generated/subgraph'

export function useBadgeKlerosMetadata(badgeId: string, options?: BadgeModelHooksOptions) {
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeId.length
  const gql = useSubgraph()
  return useSWR(fetchIt ? [`BadgeKlerosMetadata:${badgeId}`, badgeId] : null, async ([, _id]) => {
    const badgeKleros = await gql.badgeKlerosMetadataById({ id: _id })

    return badgeKleros.badgeKlerosMetaData
  })
}

export function useEvidenceBadgeKlerosMetadata(badgeId: string, options?: BadgeModelHooksOptions) {
  const badge = useBadgeById(badgeId)
  const badgeKlerosMetadata = useBadgeKlerosMetadata(badgeId, options)
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeId.length
  return useSWR(
    fetchIt ? [`EvidenceBadgeKlerosMetadata:${badgeId}`, badgeId, badge.data?.id] : null,
    async ([,]) => {
      if (!badgeKlerosMetadata.data?.requests) {
        throw 'There was not possible to get the needed metadata. Try again in some minutes.'
      }

      const registrationRequest = badgeKlerosMetadata.data.requests.find(
        (r) => r.type === KlerosRequestType.Registration,
      )
      const registrationEvidence = registrationRequest?.evidences.find(
        (e) => e.sender === badge.data?.account.id,
      )
      const metadataHash = registrationEvidence?.uri?.replace(/^ipfs?:\/\//, '')

      const res = await getFromIPFS<BadgeEvidenceMetadata, { s3Url: string }>(metadataHash)

      const requestBadgeEvidence = res ? res.data.result?.content : null
      const requestBadgeEvidenceRawUrl = res ? res.data.result?.s3Url : null

      return {
        ...badgeKlerosMetadata.data,
        requestBadgeEvidence,
        requestBadgeEvidenceRawUrl,
      }
    },
  )
}