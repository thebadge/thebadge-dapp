import React from 'react'

import { Box, Typography, alpha, styled } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import {
  BADGE_MODEL_BACKGROUNDS,
  BADGE_MODEL_TEXT_CONTRAST,
} from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'
import {
  generateLegalPrivacyPolicyUrl,
  generateLegalTermsUrl,
} from '@/src/utils/navigation/generateUrl'
const BoxShadow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  filter: `drop-shadow(0px 0px 15px ${alpha(theme.palette.text.primary, 0.3)})`,
}))

export default function BadgeModelConfirmation() {
  const { t } = useTranslation()
  const { watch } = useFormContext<CreateCommunityModelSchemaType>()

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
          {t('badge.model.create.confirmation.youAgree')}
          <a href={generateLegalTermsUrl()} target="_blank">
            {t('badge.model.create.confirmation.termsOfUse')}
          </a>
          {t('badge.model.create.confirmation.and')}
          <a href={generateLegalPrivacyPolicyUrl()} target="_blank">
            {t('badge.model.create.confirmation.privacy')}
          </a>
          .
        </Typography>
      </Box>
    </>
  )
}
