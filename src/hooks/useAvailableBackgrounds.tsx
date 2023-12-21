import { useEffect, useState } from 'react'

import { ModelsBackgrounds, getBadgeModelBackgrounds } from '@/src/constants/backgrounds'
import { useBadgesRequired } from '@/src/hooks/theBadge/useBadgesRequired'
import { ChainsValues } from '@/types/chains'

type AvailableBackgroundType = { disabled: boolean; key: string }

export const useAvailableBackgrounds = (
  chainId: ChainsValues,
  userAddress?: string,
): {
  availableBackgrounds: AvailableBackgroundType[]
  modelBackgrounds: ModelsBackgrounds | undefined
} => {
  const { hasUserBalance } = useBadgesRequired()
  const [availableBackgrounds, setAvailableBackgrounds] = useState<ModelsBackgrounds | undefined>(
    undefined,
  )

  useEffect(() => {
    const fetchAvailableBackgrounds = async () => {
      const backgrounds = await getBadgeModelBackgrounds()
      setAvailableBackgrounds(backgrounds)
    }
    fetchAvailableBackgrounds()
  }, [setAvailableBackgrounds])

  let availableBackgroundsResult: AvailableBackgroundType[] = []
  if (availableBackgrounds) {
    Object.entries(availableBackgrounds).forEach(async ([, backgroundConfig]) => {
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
}
