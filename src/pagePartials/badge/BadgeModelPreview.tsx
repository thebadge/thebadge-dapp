import * as React from 'react'

import { Box } from '@mui/material'
import { BadgePreview, BadgePreviewProps } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import { useAvailableBackgrounds } from '@/src/hooks/useAvailableBackgrounds'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getBackgroundType, getTextContrast } from '@/src/utils/badges/metadataHelpers'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  metadata?: string
  badgeUrl?: string
  effects?: boolean
  size?: BadgePreviewProps['size']
  clickable?: boolean
}

function BadgeModelPreview({ badgeUrl, clickable, effects, metadata, size = 'medium' }: Props) {
  const res = useS3Metadata<{ content: BadgeModelMetadata<BackendFileResponse> }>(metadata || '')
  const badgeMetadata = res.data?.content

  const backgroundType = getBackgroundType(badgeMetadata?.attributes)
  const textContrast = getTextContrast(badgeMetadata?.attributes)
  const { address, readOnlyChainId } = useWeb3Connection()
  const { modelBackgrounds } = useAvailableBackgrounds(readOnlyChainId, address)

  return (
    <SafeSuspense>
      <Box sx={{ cursor: clickable ? 'pointer' : 'inherit' }}>
        <BadgePreview
          animationEffects={effects ? ['wobble', 'grow', 'glare'] : []}
          animationOnHover
          badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value, modelBackgrounds)}
          badgeUrl={badgeUrl ? badgeUrl : 'https://www.thebadge.xyz'}
          category={badgeMetadata?.name}
          description={badgeMetadata?.description}
          imageUrl={badgeMetadata?.image.s3Url}
          size={size}
          textContrast={textContrast?.value || 'light-withTextBackground'}
        />
      </Box>
    </SafeSuspense>
  )
}

export default BadgeModelPreview
