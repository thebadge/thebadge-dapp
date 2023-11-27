import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import useClaimParams from '@/src/hooks/nextjs/useClaimParams'
import { BackendResponse } from '@/types/utils'

/**
 * Helper hook to get the badge from the url params
 */
export default function useBadgeIDFromULID() {
  const { claimUUID } = useClaimParams()

  return useSWR(claimUUID ? [`badgeId:${claimUUID}`, claimUUID] : null, async ([, _ulid]) => {
    const res = await axios.get<BackendResponse<{ badgeId: string }>>(
      `${BACKEND_URL}/api/thirdPartyController/claim/badgeId/${_ulid}`,
    )
    return res.data.result?.badgeId
  })
}
