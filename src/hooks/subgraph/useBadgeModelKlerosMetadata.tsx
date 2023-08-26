import useSWR from 'swr'

import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import useChainId from '@/src/hooks/theBadge/useChainId'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'

/**
 * The BadgeModelKlerosMetadata provides additional information about a BadgeModel within the Kleros system.
 * @param badgeModelId
 * @param options
 * @return SWRResponse<BadgeModelKlerosMetaData>
 */
export function useBadgeModelKlerosMetadata(
  badgeModelId: string,
  options?: BadgeModelHooksOptions,
) {
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  const gql = useSubgraph()
  const chainId = useChainId()

  return useSWR(
    fetchIt ? [`BadgeModelKlerosMetadata:${badgeModelId}`, badgeModelId, chainId] : null,
    async ([, _id]) => {
      const badgeModelKleros = await gql.badgeModelKlerosMetadataById({ id: _id })

      return badgeModelKleros.badgeModelKlerosMetaData
    },
  )
}

/**
 * Returns the BadgeModelKlerosMetaData and the KlerosListStructure for the Badge "registration"(mint) process
 * @param badgeModelId
 * @param options
 * @return SWRResponse<BadgeModelKlerosMetaData>
 */
export function useRegistrationBadgeModelKlerosMetadata(
  badgeModelId: string,
  options?: BadgeModelHooksOptions,
) {
  const chainId = useChainId()
  const badgeModelKlerosMetadata = useBadgeModelKlerosMetadata(badgeModelId, options)
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  return useSWR(
    fetchIt
      ? [
          `RegistrationBadgeModelKlerosMetadata:${badgeModelId}`,
          badgeModelId,
          badgeModelKlerosMetadata.data?.id,
          chainId,
        ]
      : null,
    async ([,]) => {
      const badgeModelKlerosData = badgeModelKlerosMetadata.data
      console.log(badgeModelKlerosData)
      const res = await getFromIPFS<KlerosListStructure>(badgeModelKlerosData?.registrationUri)
      console.log(res)

      const badgeModelKlerosRegistrationMetadata = res ? res.data.result?.content : null

      let badgeRegistrationCriteria = ''
      if (badgeModelKlerosRegistrationMetadata?.fileURI) {
        badgeRegistrationCriteria =
          's3Url' in badgeModelKlerosRegistrationMetadata.fileURI
            ? badgeModelKlerosRegistrationMetadata.fileURI.s3Url
            : ''
      }
      if (
        badgeModelKlerosRegistrationMetadata?.fileHash &&
        typeof badgeModelKlerosRegistrationMetadata.fileHash === 'string'
      ) {
        badgeRegistrationCriteria = badgeModelKlerosRegistrationMetadata.fileHash
      }

      return {
        ...badgeModelKlerosData,
        badgeModelKlerosRegistrationMetadata,
        badgeRegistrationCriteria,
      }
    },
  )
}

/**
 * Returns the BadgeModelKlerosMetaData and the KlerosListStructure for the Badge "removal"(challenge to remove it) process
 * @param badgeModelId
 * @param options
 * @return SWRResponse<BadgeModelKlerosMetaData>
 */
export function useRemovalBadgeModelKlerosMetadata(
  badgeModelId: string,
  options?: BadgeModelHooksOptions,
) {
  const chainId = useChainId()
  const badgeModelKlerosMetadata = useBadgeModelKlerosMetadata(badgeModelId, options)
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  return useSWR(
    fetchIt
      ? [
          `RemovalBadgeModelKlerosMetadata:${badgeModelId}`,
          badgeModelId,
          badgeModelKlerosMetadata.data?.id,
          chainId,
        ]
      : null,
    async ([,]) => {
      const badgeModelKlerosData = badgeModelKlerosMetadata.data

      if (!badgeModelKlerosData?.removalUri) {
        throw 'There was not possible to get the needed metadata. Try again in some minutes.'
      }

      const removalHash = badgeModelKlerosData.removalUri.replace(/^ipfs?:\/\//, '')

      const res = await getFromIPFS<KlerosListStructure>(removalHash)

      const badgeModelKlerosRemovalMetadata = res ? res.data.result?.content : null

      let badgeRemovalCriteria = ''
      if (badgeModelKlerosRemovalMetadata?.fileURI) {
        badgeRemovalCriteria =
          's3Url' in badgeModelKlerosRemovalMetadata.fileURI
            ? badgeModelKlerosRemovalMetadata.fileURI.s3Url
            : ''
      }
      if (
        badgeModelKlerosRemovalMetadata?.fileHash &&
        typeof badgeModelKlerosRemovalMetadata.fileHash === 'string'
      ) {
        badgeRemovalCriteria = badgeModelKlerosRemovalMetadata.fileHash
      }

      return {
        ...badgeModelKlerosData,
        badgeModelKlerosRemovalMetadata,
        badgeRemovalCriteria,
      }
    },
  )
}
