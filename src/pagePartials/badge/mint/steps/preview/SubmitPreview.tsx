import { useCallback, useEffect } from 'react'
import * as React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import MintCost from './MintCost'
import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import useBadgePreviewUrl from '@/src/hooks/theBadge/useBadgePreviewUrl'
import useEstimateBadgeId from '@/src/hooks/theBadge/useEstimateBadgeId'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import { useAvailableBackgrounds } from '@/src/hooks/useAvailableBackgrounds'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import { convertPreviewToImage } from '@/src/pagePartials/badge/mint/utils'
import { getBackgroundType, getTextContrast } from '@/src/utils/badges/metadataHelpers'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function SubmitPreview({
  badgePreviewRef,
}: {
  badgePreviewRef: React.MutableRefObject<HTMLDivElement | undefined>
}) {
  const { t } = useTranslation()
  const { address, appChainId, readOnlyChainId } = useWeb3Connection()
  const { setValue } = useFormContext<MintBadgeSchemaType>() // retrieve all hook methods

  const { badgeModelId } = useModelIdParam()
  const badgeModelData = useBadgeModel(badgeModelId)
  const template = useBadgeModelTemplate(badgeModelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata
  const { data: estimatedBadgeId } = useEstimateBadgeId()
  const availableBackgroundsData = useAvailableBackgrounds(readOnlyChainId, address)
  const modelBackgrounds = availableBackgroundsData.data?.modelBackgrounds

  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const backgroundType = getBackgroundType(badgeModelMetadata?.attributes)

  const textContrast = getTextContrast(badgeModelMetadata?.attributes)

  // Get kleros deposit value for the badge model
  const { data: mintValue } = useMintValue(badgeModelId)
  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for the badge model: ${badgeModelId}`
  }
  const creatorFee = BigNumber.from(badgeModelData.data?.badgeModel.creatorFee || 0)

  if (badgeModelData.error || !badgeModelData.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const estimatedBadgeIdForPreview = estimatedBadgeId ? estimatedBadgeId.toString() : '0'
  const urlsData = useBadgePreviewUrl(
    estimatedBadgeIdForPreview,
    badgeModelData.data.badgeModel.contractAddress,
    appChainId,
  )
  const previewUrls = urlsData.data

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
      <Typography>
        {t('badge.model.mint.previewTitle', {
          badgeModelTemplate: template,
        })}
      </Typography>
      <Box ref={badgePreviewRef}>
        <BadgePreview
          animationEffects={['wobble', 'grow', 'glare']}
          animationOnHover
          badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value, modelBackgrounds)}
          badgeUrl={previewUrls?.shortPreviewUrl}
          category={badgeModelMetadata?.name}
          description={badgeModelMetadata?.description}
          imageUrl={badgeLogoImage?.s3Url}
          size="medium"
          textContrast={textContrast?.value || 'light-withTextBackground'}
        />
      </Box>
      <MintCost
        costs={{
          mintCost: formatUnits(creatorFee, 18),
          totalMintCost: formatUnits(mintValue, 18),
          klerosCost: formatUnits(mintValue.sub(creatorFee), 18),
        }}
      />
    </Stack>
  )
}
