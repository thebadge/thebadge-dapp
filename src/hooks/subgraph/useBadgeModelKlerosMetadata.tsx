import useSWR from 'swr'

import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'

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
  const badgeModelKlerosMetadata = useBadgeModelKlerosMetadata(badgeModelId, options)
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  return useSWR(
    fetchIt ? [`RegistrationBadgeModelKlerosMetadata:${badgeModelId}`, badgeModelId] : null,
    async ([,]) => {
      const badgeModelKlerosData = badgeModelKlerosMetadata.data

      if (!badgeModelKlerosData?.registrationUri) {
        throw 'There was not possible to get the needed metadata. Try again in some minutes.'
      }

      const metadataHash = badgeModelKlerosData.registrationUri.replace(/^ipfs?:\/\//, '')

      const res = await getFromIPFS<KlerosListStructure>(metadataHash)

      const badgeModelKlerosRegistrationMetadata = res ? res.data.result?.content : null

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
  const badgeModelKlerosMetadata = useBadgeModelKlerosMetadata(badgeModelId, options)
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  return useSWR(
    fetchIt ? [`RemovalBadgeModelKlerosMetadata:${badgeModelId}`, badgeModelId] : null,
    async ([,]) => {
      const badgeModelKlerosData = badgeModelKlerosMetadata.data

      if (!badgeModelKlerosData?.removalUri) {
        throw 'There was not possible to get the needed metadata. Try again in some minutes.'
      }

      const removalHash = badgeModelKlerosData.removalUri.replace(/^ipfs?:\/\//, '')

      const res = await getFromIPFS<KlerosListStructure>(removalHash)

      const badgeModelKlerosRemovalMetadata = res ? res.data.result?.content : null

      return {
        ...badgeModelKlerosData,
        badgeModelKlerosRemovalMetadata,
      }
    },
  )
}
