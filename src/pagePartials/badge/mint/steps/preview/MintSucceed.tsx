import * as React from 'react'

import { Stack } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'

import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import { generateModelPreviewUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'

export default function MintSucceed() {
  const { address } = useWeb3Connection()
  const { badgeModelId } = useModelIdParam()

  const badgeModelData = useBadgeModel(badgeModelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const backgroundType = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.Background,
  )

  const textContrast = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.TextContrast,
  )

  // TODO Fetch the new badgeId minted from the graph and use this to generate the badgeUrl
  return (
    <Stack alignItems="center">
      <BadgePreview
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
        badgeUrl={generateModelPreviewUrl(badgeModelId, address as string)}
        category={badgeModelMetadata?.name}
        description={badgeModelMetadata?.description}
        imageUrl={badgeLogoImage?.s3Url}
        size="medium"
        textContrast={textContrast?.value || 'light-withTextBackground'}
      />
    </Stack>
  )
}
