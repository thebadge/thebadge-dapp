import * as React from 'react'

import { IconBadge, MiniBadgePreview, colors } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useColorMode } from '@/src/providers/themeProvider'
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import { BadgeModelMetadata, BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  metadata?: string
  highlightColor?: string
  disableAnimations?: boolean
  onClick?: () => void
  buttonTitle?: string
}

function MiniBadgeModelPreview({
  buttonTitle,
  disableAnimations,
  highlightColor,
  metadata,
  onClick,
}: Props) {
  const res = useS3Metadata<{ content: BadgeModelMetadata<BackendFileResponse> }>(metadata || '')
  const { mode } = useColorMode()
  const badgeMetadata = res.data?.content

  const backgroundType = badgeMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.Background,
  )

  const textContrast = badgeMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.TextContrast,
  )

  return (
    <SafeSuspense>
      <MiniBadgePreview
        animationEffects={!disableAnimations ? ['wobble', 'grow', 'glare'] : []}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
        buttonTitle={buttonTitle}
        description={badgeMetadata?.description}
        height={'50px'}
        highlightColor={highlightColor || (mode === 'light' ? colors.blackText : colors.white)}
        imageUrl={badgeMetadata?.image.s3Url}
        miniIcon={<IconBadge color={colors.white} height={25} width={25} />}
        onClick={onClick}
        textContrast={textContrast?.value || 'light-withTextBackground'}
        textContrastOutside={mode}
        title={badgeMetadata?.name}
      />
    </SafeSuspense>
  )
}

export default MiniBadgeModelPreview
