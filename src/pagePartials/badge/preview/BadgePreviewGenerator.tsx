import { useCallback, useEffect, useRef } from 'react'
import * as React from 'react'

import { Box } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { UseFormSetValue } from 'react-hook-form'

import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { convertPreviewToImage } from '@/src/pagePartials/badge/mint/utils'
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import { BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'

type BadgePreviewGeneratorProps = {
  modelId: string
  setValue: UseFormSetValue<any>
  badgeUrl?: string
  additionalData?: Record<string, any>
}

export const BadgePreviewGenerator = ({
  badgeUrl,
  modelId,
  setValue,
}: BadgePreviewGeneratorProps) => {
  const badgePreviewRef = useRef<HTMLDivElement>()
  const badgeModelData = useBadgeModel(modelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata
  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const backgroundType = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.Background,
  )

  const textContrast = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.TextContrast,
  )

  const generatePreviewImage = useCallback(
    async (badgePreviewRef: React.MutableRefObject<HTMLDivElement | undefined>) => {
      const previewImage = await convertPreviewToImage(badgePreviewRef)
      setValue('previewImage', previewImage)
    },
    [setValue],
  )

  useEffect(() => {
    if (badgePreviewRef.current) {
      generatePreviewImage(badgePreviewRef)
    }
  }, [badgePreviewRef, generatePreviewImage])

  return (
    <Box ref={badgePreviewRef}>
      <BadgePreview
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
        badgeUrl={badgeUrl}
        category={badgeModelMetadata?.name}
        description={badgeModelMetadata?.description}
        imageUrl={badgeLogoImage?.s3Url}
        size="medium"
        textContrast={textContrast?.value || 'light-withTextBackground'}
      />
    </Box>
  )
}