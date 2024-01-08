import * as React from 'react'

import { IconBadge, MiniBadgePreview, colors } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import { useAvailableBackgrounds } from '@/src/hooks/useAvailableBackgrounds'
import useS3Metadata, { DEFAULT_FALLBACK_CONTENT_METADATA } from '@/src/hooks/useS3Metadata'
import { useColorMode } from '@/src/providers/themeProvider'
import { getBackgroundType, getTextContrast } from '@/src/utils/badges/metadataHelpers'
import enrichTextWithValues, { EnrichTextValues } from '@/src/utils/enrichTextWithValues'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

type Props = {
  badgeModelMetadata?: string
  highlightColor?: string
  disableAnimations?: boolean
  onClick?: () => void
  buttonTitle?: string
  additionalData?: Record<string, any>
}

function BadgeMiniPreview({
  additionalData,
  badgeModelMetadata,
  buttonTitle,
  disableAnimations,
  highlightColor,
  onClick,
}: Props) {
  const { mode } = useColorMode()
  const { address, readOnlyChainId } = useWeb3Connection()

  const { data } = useS3Metadata<{ content: BadgeModelMetadata<BackendFileResponse> }>(
    badgeModelMetadata || '',
    {
      content: DEFAULT_FALLBACK_CONTENT_METADATA,
    },
  )
  const modelMetadataContent = data?.content

  const backgroundType = getBackgroundType(modelMetadataContent?.attributes)
  const textContrast = getTextContrast(modelMetadataContent?.attributes)

  const availableBackgroundsData = useAvailableBackgrounds(readOnlyChainId, address)
  const modelBackgrounds = availableBackgroundsData.data?.modelBackgrounds

  return (
    <SafeSuspense>
      <MiniBadgePreview
        animationEffects={!disableAnimations ? ['wobble', 'grow', 'glare'] : []}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value, modelBackgrounds)}
        buttonTitle={buttonTitle}
        description={enrichTextWithValues(
          modelMetadataContent?.description,
          additionalData as EnrichTextValues,
        )}
        height={'50px'}
        highlightColor={highlightColor || (mode === 'light' ? colors.blackText : colors.white)}
        imageUrl={modelMetadataContent?.image.s3Url}
        miniIcon={<IconBadge color={colors.white} height={25} width={25} />}
        onClick={onClick}
        textContrast={textContrast?.value || 'light-withTextBackground'}
        textContrastOutside={mode}
        title={enrichTextWithValues(modelMetadataContent?.name, additionalData as EnrichTextValues)}
      />
    </SafeSuspense>
  )
}

export default BadgeMiniPreview
