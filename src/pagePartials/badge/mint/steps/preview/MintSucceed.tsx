import * as React from 'react'

import { Stack } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'

import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useBadgePreviewUrl from '@/src/hooks/theBadge/useBadgePreviewUrl'
import useEstimateBadgeId from '@/src/hooks/theBadge/useEstimateBadgeId'
import { useAvailableBackgrounds } from '@/src/hooks/useAvailableBackgrounds'
import { getBackgroundType, getTextContrast } from '@/src/utils/badges/metadataHelpers'

const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function MintSucceed() {
  const { address, appChainId, readOnlyChainId } = useWeb3Connection()
  const { badgeModelId } = useModelIdParam()
  const { data: estimatedBadgeId } = useEstimateBadgeId()

  const badgeModelData = useBadgeModel(badgeModelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const backgroundType = getBackgroundType(badgeModelMetadata?.attributes)
  const textContrast = getTextContrast(badgeModelMetadata?.attributes)
  const { modelBackgrounds } = useAvailableBackgrounds(readOnlyChainId, address)

  if (badgeModelData.error || !badgeModelData.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  // TODO Fetch the new badgeId minted from the graph and use this to generate the badgeUrl
  const estimatedBadgeIdForPreview = estimatedBadgeId ? estimatedBadgeId.sub(1).toString() : '0'

  const { shortPreviewURl } = useBadgePreviewUrl(
    estimatedBadgeIdForPreview,
    badgeModelData.data.badgeModel.contractAddress,
    appChainId,
  )

  return (
    <Stack alignItems="center">
      <BadgePreview
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value, modelBackgrounds)}
        badgeUrl={shortPreviewURl}
        category={badgeModelMetadata?.name}
        description={badgeModelMetadata?.description}
        imageUrl={badgeLogoImage?.s3Url}
        size="medium"
        textContrast={textContrast?.value || 'light-withTextBackground'}
      />
    </Stack>
  )
}
