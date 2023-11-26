import { useRouter } from 'next/router'
import * as React from 'react'

import { Button, Divider, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { StepClaimThirdPartyPreview } from '@/src/pagePartials/badge/claim/steps/StepsClaimThirdPartyPreview'
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
      <StepClaimThirdPartyPreview />
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
