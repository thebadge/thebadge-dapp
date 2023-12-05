import { useMemo } from 'react'

import { APP_URL } from '@/src/constants/common'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'
import { ChainsValues } from '@/types/chains'

export default function useBadgePreviewUrl(
  badgeId: string,
  badgeContractAddress: string,
  userChainId?: ChainsValues,
) {
  const { readOnlyChainId } = useWeb3Connection()

  return useMemo(
    () =>
      APP_URL +
      generateBadgePreviewUrl(badgeId, {
        theBadgeContractAddress: badgeContractAddress,
        connectedChainId: userChainId ? userChainId : readOnlyChainId,
      }),
    [badgeContractAddress, badgeId, userChainId, readOnlyChainId],
  )
}
