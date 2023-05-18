import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { BadgeEvidenceMetadata } from '@/types/badges/BadgeMetadata'
import { BackendResponse } from '@/types/utils'

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
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeId.length
  const gql = useSubgraph()
  return useSWR(
    fetchIt ? [`EvidenceBadgeKlerosMetadata:${badgeId}`, badgeId] : null,
    async ([, _id]) => {
      const badgeKleros = await gql.badgeKlerosMetadataById({ id: _id })

      const badgeKlerosMetadata = badgeKleros.badgeKlerosMetaData

      if (!badgeKlerosMetadata?.requests) {
        throw 'There was not possible to get the needed metadata. Try again in some minutes.'
      }

      const metadataHash = badgeKlerosMetadata.requests.requestBadgeEvidenceUri?.replace(
        /^ipfs?:\/\//,
        '',
      )

      const res = await axios.get<
        BackendResponse<{ content: BadgeEvidenceMetadata; s3Url: string }>
      >(`${BACKEND_URL}/api/ipfs/${metadataHash}`)

      const requestBadgeEvidence = res.data.result?.content
      const requestBadgeEvidenceRawUrl = res.data.result?.s3Url

      return {
        ...badgeKlerosMetadata,
        requestBadgeEvidence,
        requestBadgeEvidenceRawUrl,
      }
    },
  )
}
