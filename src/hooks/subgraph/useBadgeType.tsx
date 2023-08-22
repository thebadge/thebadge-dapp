import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'
import { BackendResponse } from '@/types/utils'

/**
 * Hooks to wrap the getBadgeType graphql query, to take advantage of the SWR cache
 * and reduce the number of queries and also reduce the repeated code
 * @param id
 */
export default function useBadgeModel(id: string) {
  const gql = useSubgraph()
  return useSWR(id.length ? [`BadgeModel:${id}`, id] : null, async ([, _id]) => {
    const badgeType = await gql.badgeModel({ id: _id })

    const badgeModelData = badgeType.badgeModel

    if (!badgeModelData?.badgeModelKleros?.registrationUri) {
      throw 'There was not possible to get the needed metadata. Try again in some minutes.'
    }

    const cleanedHash = badgeModelData?.badgeModelKleros?.registrationUri.replace(/^ipfs?:\/\//, '')

    // TODO: hardcoded for now, as we only support Kleros.
    const res = await axios.get<BackendResponse<{ content: KlerosListStructure }>>(
      `${BACKEND_URL}/api/ipfs/${cleanedHash}`,
    )
    const badgeModelMetadata = res.data.result?.content

    return {
      badgeModel: badgeModelData,
      badgeModelMetadata,
    }
  })
}
