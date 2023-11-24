import axios from 'axios'
import useSWR from 'swr'

import { BACKEND_URL } from '@/src/constants/common'
import useClaimUUIDParam from '@/src/hooks/nextjs/useClaimUUIDParam'
import { BackendResponse } from '@/types/utils'

/**
 * Helper hook to get the badge from the url params
 */
export default function useBadgeIDFromULID() {
  const claimUUID = useClaimUUIDParam()

  return useSWR(claimUUID ? [`badgeId:${claimUUID}`, claimUUID] : null, async ([, _ulid]) => {
    const res = await axios.get<BackendResponse<{ badgeId: string }>>(
      `${BACKEND_URL}/api/thirdPartyController/claim/badgeId/${_ulid}`,
    )
    return res.data.result?.badgeId
  })
}
