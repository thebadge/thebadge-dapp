import { useCallback, useEffect } from 'react'
import * as React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import { APP_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import MintCostThirdParty from '@/src/pagePartials/badge/mint/steps/preview/MintCostThirdParty'
import { convertPreviewToImage } from '@/src/pagePartials/badge/mint/utils'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import { BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'

export default function SubmitPreviewThirdParty({
  badgePreviewRef,
}: {
  badgePreviewRef: React.MutableRefObject<HTMLDivElement | undefined>
}) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { setValue } = useFormContext<MintBadgeSchemaType>() // retrieve all hook methods

  const modelId = useModelIdParam()
  const badgeModelData = useBadgeModel(modelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const backgroundType = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.Background,
  )

  const textContrast = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.TextContrast,
  )

  // Get kleros deposit value for the badge model
  const { data: mintValue } = useMintValue(modelId)
  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for the badge model: ${modelId}`
  }

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
    <Stack alignItems={'center'} gap={3} margin={1}>
      <Typography>{t('badge.model.mint.previewTitle')}</Typography>
      <Box ref={badgePreviewRef}>
        <BadgePreview
          animationEffects={['wobble', 'grow', 'glare']}
          animationOnHover
          badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
          badgeUrl={`${APP_URL}/${modelId}/${address}`}
          category={badgeModelMetadata?.name}
          description={badgeModelMetadata?.description}
          imageUrl={badgeLogoImage?.s3Url}
          size="medium"
          textContrast={textContrast?.value || 'light-withTextBackground'}
        />
      </Box>
      <MintCostThirdParty
        costs={{
          totalMintCost: formatUnits(mintValue, 18),
        }}
      />
    </Stack>
  )
}
