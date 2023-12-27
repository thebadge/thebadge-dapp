import useSWR from 'swr'

import { getBadgeModelBackgrounds } from '@/src/constants/backgrounds'
import { useBadgesRequired } from '@/src/hooks/theBadge/useBadgesRequired'
import { ChainsValues } from '@/types/chains'

type AvailableBackgroundType = { disabled: boolean; key: string }

export const useAvailableBackgrounds = (chainId: ChainsValues, userAddress?: string) => {
  const { hasUserBalance } = useBadgesRequired()

  return useSWR(userAddress ? `availableBackgrounds:${userAddress}` : null, async () => {
    const availableBackgrounds = await getBadgeModelBackgrounds()

    let availableBackgroundsResult: AvailableBackgroundType[] = []
    if (availableBackgrounds) {
      const availableBackgroundsPromises = Object.entries(availableBackgrounds).map(
        async ([, backgroundConfig]) => {
          if (backgroundConfig.badgesRequired.length) {
            if (!userAddress) {
              backgroundConfig.disabled = true
            } else {
              const networkBadge = backgroundConfig.badgesRequired.find(
                (badgeRequired) => badgeRequired.networkId === chainId,
              )
              // If the badge is available on that network we check the balance otherwise is 0
              const hasBalance = networkBadge
                ? await hasUserBalance(networkBadge, userAddress)
                : false
              backgroundConfig.disabled = !hasBalance
            }
            backgroundConfig.disabled = true
          }
        },
      )
      await Promise.all(availableBackgroundsPromises)

      availableBackgroundsResult = Object.entries(availableBackgrounds).map(
        ([backgroundName, backgroundConfig]) => {
          return {
            key: backgroundName,
            disabled: backgroundConfig.disabled || false,
          }
        },
      )
    }

    return {
      availableBackgrounds: availableBackgroundsResult,
      modelBackgrounds: availableBackgrounds,
    }
  })
}
