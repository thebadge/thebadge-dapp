import React from 'react'

import { Box, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import BadgeModelCreationPreview from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelCreationPreview'
import {
  generateLegalPrivacyPolicyUrl,
  generateLegalTermsUrl,
} from '@/src/utils/navigation/generateUrl'

export default function BadgeModelConfirmation() {
  const { t } = useTranslation()

  return (
    <>
      <BadgeModelCreationPreview />
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
