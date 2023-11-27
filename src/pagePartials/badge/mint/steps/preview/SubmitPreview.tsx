import { useCallback, useEffect } from 'react'
import * as React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import MintCost from './MintCost'
import { APP_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import useEstimateBadgeId from '@/src/hooks/theBadge/useEstimateBadgeId'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import { convertPreviewToImage } from '@/src/pagePartials/badge/mint/utils'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'

export default function SubmitPreview({
  badgePreviewRef,
}: {
  badgePreviewRef: React.MutableRefObject<HTMLDivElement | undefined>
}) {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const { setValue } = useFormContext<MintBadgeSchemaType>() // retrieve all hook methods

  const { badgeModelId } = useModelIdParam()
  const badgeModelData = useBadgeModel(badgeModelId)
  const template = useBadgeModelTemplate(badgeModelId)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata
  const { data: estimatedBadgeId } = useEstimateBadgeId()

  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const backgroundType = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.Background,
  )

  const textContrast = badgeModelMetadata?.attributes?.find(
    (at) => at.trait_type === BadgeNFTAttributesType.TextContrast,
  )

  // Get kleros deposit value for the badge model
  const { data: mintValue } = useMintValue(badgeModelId)
  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for the badge model: ${badgeModelId}`
  }
  const creatorFee = BigNumber.from(badgeModelData.data?.badgeModel.creatorFee || 0)

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

  if (badgeModelData.error || !badgeModelData.data) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const estimatedBadgeIdForPreview = estimatedBadgeId ? estimatedBadgeId.toString() : '0'

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
