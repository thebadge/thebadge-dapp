import useSWR from 'swr'

import { BadgeModelHooksOptions } from '@/src/hooks/subgraph/types'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { getFromIPFS } from '@/src/hooks/subgraph/utils'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
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
  const { readOnlyChainId } = useWeb3Connection()

  return useSWR(
    fetchIt ? [`BadgeModelKlerosMetadata:${badgeModelId}`, badgeModelId, readOnlyChainId] : null,
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
  const { readOnlyChainId } = useWeb3Connection()
  const badgeModelKlerosMetadata = useBadgeModelKlerosMetadata(badgeModelId, options)
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  return useSWR(
    fetchIt
      ? [
          `RegistrationBadgeModelKlerosMetadata:${badgeModelId}`,
          badgeModelId,
          badgeModelKlerosMetadata.data?.id,
          readOnlyChainId,
        ]
      : null,
    async ([,]) => {
      const badgeModelKlerosData = badgeModelKlerosMetadata.data
      const res = await getFromIPFS<KlerosListStructure>(badgeModelKlerosData?.registrationUri)

      const badgeModelKlerosRegistrationMetadata = res ? res.data.result?.content : null

      const badgeRegistrationCriteria = getCriteriaFileFromMetaEvidence(
        badgeModelKlerosRegistrationMetadata,
      )

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
  const { readOnlyChainId } = useWeb3Connection()
  const badgeModelKlerosMetadata = useBadgeModelKlerosMetadata(badgeModelId, options)
  // It's going to do the fetch if it has ID and skip option on false
  const fetchIt = !options?.skip && badgeModelId.length
  return useSWR(
    fetchIt
      ? [
          `RemovalBadgeModelKlerosMetadata:${badgeModelId}`,
          badgeModelId,
          badgeModelKlerosMetadata.data?.id,
          readOnlyChainId,
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

      const badgeRemovalCriteria = getCriteriaFileFromMetaEvidence(badgeModelKlerosRemovalMetadata)

      return {
        ...badgeModelKlerosData,
        badgeModelKlerosRemovalMetadata,
        badgeRemovalCriteria,
      }
    },
  )
}

function getCriteriaFileFromMetaEvidence(
  badgeModelKlerosMetaEvidence: KlerosListStructure | null | undefined,
) {
  let criteria = ''

  if (badgeModelKlerosMetaEvidence?.fileURI) {
    criteria =
      's3Url' in badgeModelKlerosMetaEvidence.fileURI
        ? badgeModelKlerosMetaEvidence.fileURI.s3Url
        : ''
  }
  if (
    badgeModelKlerosMetaEvidence?.fileHash &&
    typeof badgeModelKlerosMetaEvidence.fileHash === 'string'
  ) {
    criteria = badgeModelKlerosMetaEvidence.fileHash
  }

  return criteria
}
