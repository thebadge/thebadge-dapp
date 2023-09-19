import { useRouter } from 'next/router'
import * as React from 'react'

import { Button, Divider, Stack, Typography, styled } from '@mui/material'
import { BadgePreview, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { APP_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import { BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'

type StepsClaimThirdPartySucceedProps = {
  claimAddress: string
}

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.25),
  fontSize: '14px !important',
  minHeight: '30px',
}))

export default function StepsClaimThirdPartySucceed({
  claimAddress,
}: StepsClaimThirdPartySucceedProps) {
  const { t } = useTranslation()
  const router = useRouter()
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

  const handleSubmit = () => {
    router.push(`/profile/${claimAddress}`)
  }

  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mt: 8,
        gap: 4,
        alignItems: 'center',
      }}
    >
      <Typography color={colors.blue} textAlign="center" variant="title2">
        {t('badge.model.claim.thirdParty.header.titleSuccess')}
      </Typography>
      <BadgePreview
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
        badgeUrl={`${APP_URL}/${modelId}/${claimAddress}`}
        category={badgeModelMetadata?.name}
        description={badgeModelMetadata?.description}
        imageUrl={badgeLogoImage?.s3Url}
        size="medium"
        textContrast={textContrast?.value || 'light-withTextBackground'}
      />
      <Divider />
      <SubmitButton
        color="blue"
        onClick={handleSubmit}
        sx={{ m: 'auto' }}
        type="submit"
        variant="contained"
      >
        {t('badge.model.claim.thirdParty.preview.goToProfile')}
      </SubmitButton>
    </Stack>
  )
}
