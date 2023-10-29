import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import { Box, Divider, Stack, Typography, alpha, styled } from '@mui/material'
import { BadgePreview, colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'
import { useFormContext } from 'react-hook-form'

import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import { StepButton } from '@/src/pagePartials/badge/model/steps/StepFooter'
import {
  BADGE_MODEL_BACKGROUNDS,
  BADGE_MODEL_TEXT_CONTRAST,
} from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'
import { cleanCreateModelFormValues } from '@/src/pagePartials/badge/model/utils'
import { ProfileFilter } from '@/src/pagePartials/profile/Profile'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'

const BoxShadow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  filter: `drop-shadow(0px 0px 15px ${alpha(theme.palette.text.primary, 0.3)})`,
}))

export default function BadgeModelCreated() {
  const { t } = useTranslation()
  const router = useRouter()

  const { watch } = useFormContext<CreateModelSchemaType>()

  const watchedName = watch('name')
  const watchedDescription = watch('description')
  const watchedLogoUri = watch('badgeModelLogoUri')
  const watchedTextContrast = watch('textContrast')
  const watchedBackground = watch('backgroundImage')

  useEffect(() => {
    return () => cleanCreateModelFormValues()
  }, [])

  return (
    <Stack alignItems="center" gap={3} justifyContent="center">
      <BoxShadow>
        <BadgePreview
          animationEffects={['wobble', 'grow', 'glare']}
          animationOnHover
          badgeBackgroundUrl={BADGE_MODEL_BACKGROUNDS[watchedBackground]}
          badgeUrl="https://www.thebadge.xyz"
          description={watchedDescription}
          imageUrl={watchedLogoUri?.base64File}
          size="medium"
          textContrast={BADGE_MODEL_TEXT_CONTRAST[watchedTextContrast]}
          title={watchedName}
        />
      </BoxShadow>
      <Stack display="flex" flex="1" gap={1} justifyContent="center" maxWidth={480} mt={2}>
        <Typography fontSize={'14px !important'} textAlign="center" variant="body4">
          {t('badge.model.create.created.footer')}
        </Typography>
        <Divider color={colors.white} />
      </Stack>
      <StepButton
        color={'primary'}
        onClick={() => router.push(generateProfileUrl({ filter: ProfileFilter.CREATED_BADGES }))}
        sx={{ m: 'auto' }}
        variant="contained"
      >
        {t('badge.model.create.created.goToProfile')}
      </StepButton>
    </Stack>
  )
}
