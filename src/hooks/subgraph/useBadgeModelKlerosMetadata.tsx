import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { BackendResponse } from '@/types/utils'

export function useBadgeModelKlerosMetadata(
  badgeModelId: string,
  options?: BadgeModelHooksOptions,
) {
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  const gql = useSubgraph()
  return useSWR(
    fetchIt ? [`BadgeModelKlerosMetadata:${badgeModelId}`, badgeModelId] : null,
    async ([, _id]) => {
      const badgeModelKleros = await gql.badgeModelKlerosMetadataById({ id: _id })

      return badgeModelKleros.badgeModelKlerosMetaData
    },
  )
}

export function useRegistrationBadgeModelKlerosMetadata(
  badgeModelId: string,
  options?: BadgeModelHooksOptions,
) {
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  const gql = useSubgraph()
  return useSWR(
    fetchIt ? [`RegistrationBadgeModelKlerosMetadata:${badgeModelId}`, badgeModelId] : null,
    async ([, _id]) => {
      const badgeModelKleros = await gql.badgeModelKlerosMetadataById({ id: _id })

      const badgeModelKlerosData = badgeModelKleros?.badgeModelKlerosMetaData

      if (!badgeModelKlerosData?.registrationUri) {
        throw 'There was not possible to get the needed metadata. Try again in some minutes.'
      }

      const metadataHash = badgeModelKlerosData.registrationUri.replace(/^ipfs?:\/\//, '')

      const res = await axios.get<BackendResponse<{ content: KlerosListStructure }>>(
        `${BACKEND_URL}/api/ipfs/${metadataHash}`,
      )
      const badgeModelKlerosRegistrationMetadata = res.data.result?.content

      return {
        ...badgeModelKlerosData,
        badgeModelKlerosRegistrationMetadata,
      }
    },
  )
}

export function useRemovalBadgeModelKlerosMetadata(
  badgeModelId: string,
  options?: BadgeModelHooksOptions,
) {
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  const gql = useSubgraph()
  return useSWR(
    fetchIt ? [`RemovalBadgeModelKlerosMetadata:${badgeModelId}`, badgeModelId] : null,
    async ([, _id]) => {
      const badgeModelKleros = await gql.badgeModelKlerosMetadataById({ id: _id })

      const badgeModelKlerosData = badgeModelKleros?.badgeModelKlerosMetaData

      if (!badgeModelKlerosData?.removalUri) {
        throw 'There was not possible to get the needed metadata. Try again in some minutes.'
      }

      const removalHash = badgeModelKlerosData.removalUri.replace(/^ipfs?:\/\//, '')

      const res = await axios.get<BackendResponse<{ content: KlerosListStructure }>>(
        `${BACKEND_URL}/api/ipfs/${removalHash}`,
      )
      const badgeModelKlerosRemovalMetadata = res.data.result?.content

      return {
        ...badgeModelKlerosData,
        badgeModelKlerosRemovalMetadata,
      }
    },
  )
}
