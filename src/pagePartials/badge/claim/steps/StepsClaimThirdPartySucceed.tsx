import { useRouter } from 'next/router'
import * as React from 'react'

import { Button, Divider, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import useBadgeIDFromULID from '@/src/hooks/nextjs/useBadgeIDFromULID'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import { ThirdPartyPreview } from '@/src/pagePartials/badge/preview/ThirdPartyPreview'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'

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
  const badgeId = useBadgeIDFromULID()

  const requiredBadgeDataMetadata = useBadgeThirdPartyRequiredData(`${badgeId.data}` || '')

  const values = reCreateThirdPartyValuesObject(
    requiredBadgeDataMetadata.data?.requirementsDataValues || {},
    requiredBadgeDataMetadata.data?.requirementsDataColumns,
  )

  const handleSubmit = () => {
    router.push(generateProfileUrl({ address: claimAddress }))
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
      <ThirdPartyPreview additionalData={{ ...values }} modelId={modelId} />
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
