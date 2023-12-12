import { useMemo } from 'react'

import { APP_URL } from '@/src/constants/common'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { generateBadgePreviewUrl, generateOpenseaUrl } from '@/src/utils/navigation/generateUrl'
import { ChainsValues } from '@/types/chains'

export default function useBadgePreviewUrl(
  badgeId: string,
  badgeContractAddress: string,
  userChainId?: ChainsValues,
) {
  const { readOnlyChainId } = useWeb3Connection()

  const badgePreviewUrl = useMemo(
    () =>
      APP_URL +
      generateBadgePreviewUrl(badgeId, {
        theBadgeContractAddress: badgeContractAddress,
        connectedChainId: userChainId ? userChainId : readOnlyChainId,
      }),
    [badgeContractAddress, badgeId, userChainId, readOnlyChainId],
  )

  const badgeOpenseaUrl = useMemo(
    () =>
      generateOpenseaUrl({
        badgeId,
        contractAddress: badgeContractAddress,
        networkId: userChainId ? userChainId : readOnlyChainId,
      }),
    [badgeContractAddress, badgeId, userChainId, readOnlyChainId],
  )

  return { badgePreviewUrl, badgeOpenseaUrl }
}
