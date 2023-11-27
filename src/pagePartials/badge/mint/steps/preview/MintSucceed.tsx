import * as React from 'react'

import { Stack } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'

import { APP_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import useEstimateBadgeId from '@/src/hooks/theBadge/useEstimateBadgeId'
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'

export default function MintSucceed() {
  const { appChainId } = useWeb3Connection()
  const { badgeModelId } = useModelIdParam()
  const { data: estimatedBadgeId } = useEstimateBadgeId()

  const badgeModelData = useBadgeModel(badgeModelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const backgroundType = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.Background,
  )

  const textContrast = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.TextContrast,
  )

  if (badgeModelData.error || !badgeModelData.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  // TODO Fetch the new badgeId minted from the graph and use this to generate the badgeUrl
  const estimatedBadgeIdForPreview = estimatedBadgeId ? estimatedBadgeId.sub(1).toString() : '0'

  return (
    <Stack alignItems="center">
      <BadgePreview
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
        badgeUrl={
          APP_URL +
          generateBadgePreviewUrl(estimatedBadgeIdForPreview, {
            theBadgeContractAddress: badgeModelData.data.badgeModel.contractAddress,
            connectedChainId: appChainId,
          })
        }
        category={badgeModelMetadata?.name}
        description={badgeModelMetadata?.description}
        imageUrl={badgeLogoImage?.s3Url}
        size="medium"
        textContrast={textContrast?.value || 'light-withTextBackground'}
      />
    </Stack>
  )
}
