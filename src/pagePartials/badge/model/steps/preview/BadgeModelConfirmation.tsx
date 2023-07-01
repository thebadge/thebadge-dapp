import React from 'react'

import { Box, Typography, alpha, styled } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { useFormContext } from 'react-hook-form'

import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import {
  BADGE_MODEL_BACKGROUNDS,
  BADGE_MODEL_TEXT_CONTRAST,
} from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'
const BoxShadow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  filter: `drop-shadow(0px 0px 15px ${alpha(theme.palette.text.primary, 0.3)})`,
}))

export default function BadgeModelConfirmation() {
  const { watch } = useFormContext<CreateModelSchemaType>()

  const watchedName = watch('name')
  const watchedDescription = watch('description')
  const watchedLogoUri = watch('badgeModelLogoUri')
  const watchedTextContrast = watch('textContrast')
  const watchedBackground = watch('backgroundImage')

  return (
    <>
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
      <Box display="flex" flex="1" justifyContent="center" mt={2}>
        <Typography
          fontSize={'14px !important'}
          sx={{ '& a': { textDecoration: 'underline !important' } }}
          textAlign="center"
          variant="body4"
        >
          By continuing, you agree to our{' '}
          <a href="/legal/terms" target="_blank">
            terms of use
          </a>{' '}
          and{' '}
          <a href="/legal/privacy-policy" target="_blank">
            privacy policy
          </a>
          .
        </Typography>
      </Box>
    </>
  )
}
