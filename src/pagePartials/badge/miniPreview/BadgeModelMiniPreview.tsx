import * as React from 'react'

import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import { IconBadge, MiniBadgePreview, colors } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import { useAvailableBackgrounds } from '@/src/hooks/useAvailableBackgrounds'
import useS3Metadata, { DEFAULT_FALLBACK_CONTENT_METADATA } from '@/src/hooks/useS3Metadata'
import { useColorMode } from '@/src/providers/themeProvider'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { getBackgroundType, getTextContrast } from '@/src/utils/badges/metadataHelpers'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  metadata?: string
  highlightColor?: string
  disableAnimations?: boolean
  onClick?: () => void
  buttonTitle?: string
  controllerType?: BadgeModelControllerType | string
}

function BadgeModelMiniPreview({
  buttonTitle,
  controllerType = BadgeModelControllerType.Community,
  disableAnimations,
  highlightColor,
  metadata,
  onClick,
}: Props) {
  const { mode } = useColorMode()
  const { data } = useS3Metadata<{ content: BadgeModelMetadata<BackendFileResponse> }>(
    metadata || '',
    {
      content: DEFAULT_FALLBACK_CONTENT_METADATA,
    },
  )
  const badgeMetadata = data?.content

  const backgroundType = getBackgroundType(badgeMetadata?.attributes)
  const textContrast = getTextContrast(badgeMetadata?.attributes)
  const { address, readOnlyChainId } = useWeb3Connection()
  const availableBackgroundsData = useAvailableBackgrounds(readOnlyChainId, address)
  const modelBackgrounds = availableBackgroundsData.data?.modelBackgrounds

  return (
    <SafeSuspense>
      <MiniBadgePreview
        animationEffects={!disableAnimations ? ['wobble', 'grow', 'glare'] : []}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value, modelBackgrounds)}
        buttonTitle={buttonTitle}
        description={badgeMetadata?.description}
        height={'50px'}
        highlightColor={highlightColor || (mode === 'light' ? colors.blackText : colors.white)}
        imageUrl={badgeMetadata?.image?.s3Url}
        miniIcon={
          controllerType === BadgeModelControllerType.Community ? (
            <IconBadge color={colors.white} height={25} width={25} />
          ) : (
            <ApartmentOutlinedIcon sx={{ height: 25, width: 25, color: colors.white }} />
          )
        }
        onClick={onClick}
        textContrast={textContrast?.value || 'light-withTextBackground'}
        textContrastOutside={mode}
        title={badgeMetadata?.name}
      />
    </SafeSuspense>
  )
}

export default BadgeModelMiniPreview
