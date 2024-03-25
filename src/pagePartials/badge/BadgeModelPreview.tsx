import { ChainsValues } from '@/types/chains'

import * as React from 'react'

import { Box } from '@mui/material'
import { BadgePreview, BadgePreviewProps } from '@thebadge/ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getChainLogo } from '@/src/config/web3'
import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import { useAvailableBackgrounds } from '@/src/hooks/useAvailableBackgrounds'
import useS3Metadata, { DEFAULT_FALLBACK_CONTENT_METADATA } from '@/src/hooks/useS3Metadata'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { getBackgroundType, getTextContrast } from '@/src/utils/badges/metadataHelpers'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  metadata?: string
  badgeUrl?: string
  effects?: boolean
  size?: BadgePreviewProps['size']
  clickable?: boolean
  chainId?: ChainsValues
}

function BadgeModelPreview({
  badgeUrl,
  chainId,
  clickable,
  effects,
  metadata,
  size = 'medium',
}: Props) {
  const res = useS3Metadata<{ content: BadgeModelMetadata<BackendFileResponse> }>(metadata || '', {
    content: DEFAULT_FALLBACK_CONTENT_METADATA,
  })
  const badgeMetadata = res.data?.content

  const backgroundType = getBackgroundType(badgeMetadata?.attributes)
  const textContrast = getTextContrast(badgeMetadata?.attributes)
  const { address, readOnlyChainId } = useWeb3Connection()
  const availableBackgroundsData = useAvailableBackgrounds(readOnlyChainId, address)
  const modelBackgrounds = availableBackgroundsData.data?.modelBackgrounds

  return (
    <SafeSuspense>
      <Box sx={{ cursor: clickable ? 'pointer' : 'inherit' }}>
        <BadgePreview
          animationEffects={effects ? ['wobble', 'grow', 'glare'] : []}
          animationOnHover
          badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value, modelBackgrounds)}
          badgeNetworkUrl={chainId && getChainLogo(chainId)}
          badgeUrl={badgeUrl}
          category={badgeMetadata?.name}
          description={badgeMetadata?.description}
          imageUrl={badgeMetadata?.image?.s3Url}
          size={size}
          textContrast={textContrast?.value || 'light-withTextBackground'}
        />
      </Box>
    </SafeSuspense>
  )
}

export default BadgeModelPreview
