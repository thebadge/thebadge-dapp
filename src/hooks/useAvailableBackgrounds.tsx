import { BADGE_MODEL_BACKGROUNDS } from '@/src/constants/backgrounds'
import { useBadgesRequired } from '@/src/hooks/theBadge/useBadgesRequired'
import { ChainsValues } from '@/types/chains'

export const useAvailableBackgrounds = (
  chainId: ChainsValues,
  userAddress?: string,
): { disabled: boolean; key: string }[] => {
  const { hasUserBalance } = useBadgesRequired()

  Object.entries(BADGE_MODEL_BACKGROUNDS).forEach(async ([, backgroundConfig]) => {
    if (backgroundConfig.badgesRequired.length) {
      if (!userAddress) {
        backgroundConfig.disabled = true
      } else {
        const networkBadge = backgroundConfig.badgesRequired.find(
          (badgeRequired) => badgeRequired.networkId === chainId,
        )
        // If the badge is available on that network we check the balance otherwise is 0
        const hasBalance = networkBadge ? await hasUserBalance(networkBadge, userAddress) : false
        backgroundConfig.disabled = !hasBalance
      }
      backgroundConfig.disabled = true
    }
  })

  return Object.entries(BADGE_MODEL_BACKGROUNDS).map(([backgroundName, backgroundConfig]) => {
    return {
      key: backgroundName,
      disabled: backgroundConfig.disabled || false,
    }
  })
}
