import { useRouter } from 'next/router'
import * as React from 'react'

import { Button, Divider, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { TwitterShareButton, XIcon } from 'react-share'

import useClaimParams from '@/src/hooks/nextjs/useClaimParams'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useBadgePreviewUrl from '@/src/hooks/theBadge/useBadgePreviewUrl'
import { ThirdPartyPreview } from '@/src/pagePartials/badge/preview/ThirdPartyPreview'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { generateProfileUrl, generateTwitterText } from '@/src/utils/navigation/generateUrl'

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
  const { badgeId, contract, modelId } = useClaimParams()

  const { data } = useBadgeModel(modelId)

  const requiredBadgeDataMetadata = useBadgeThirdPartyRequiredData(`${badgeId}` || '', contract)
  const urlsData = useBadgePreviewUrl(badgeId, contract)
  const previewUrls = urlsData.data
  const values = reCreateThirdPartyValuesObject(
    requiredBadgeDataMetadata.data?.requirementsDataValues || {},
    requiredBadgeDataMetadata.data?.requirementsDataColumns,
  )

  const handleSubmit = () => {
    router.push(generateProfileUrl({ address: claimAddress }))
  }

  const badgeModelName = data?.badgeModelMetadata?.name || ''

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
      <ThirdPartyPreview
        additionalData={{ ...values }}
        badgeUrl={previewUrls?.shortPreviewUrl}
        modelId={modelId}
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

      <Stack>
        <TwitterShareButton
          related={['@thebadgexyz']}
          url={generateTwitterText(badgeModelName, previewUrls?.shortPreviewShareableUrl)}
        >
          <XIcon round size={32} />
        </TwitterShareButton>
      </Stack>
    </Stack>
  )
}
