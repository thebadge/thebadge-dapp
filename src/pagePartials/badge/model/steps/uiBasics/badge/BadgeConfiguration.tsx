import React from 'react'

import { Alert, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import SectionContainer from '../addons/SectionContainer'
import BadgeModelCreationPreview from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelCreationPreview'
import ModelDescriptionField from '@/src/pagePartials/badge/model/steps/uiBasics/addons/ModelDescriptionField'
import ModelNameField from '@/src/pagePartials/badge/model/steps/uiBasics/addons/ModelNameField'
import AdditionConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/badge/addons/AdditionalConfiguration'
import BadgeModelLogoField from '@/src/pagePartials/badge/model/steps/uiBasics/badge/addons/BadgeModelLogoField'
import CustomFieldsConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/badge/addons/CustomFieldsConfiguration'

export default function BadgeConfiguration() {
  const { t } = useTranslation()

  return (
    <>
      <SectionContainer>
        <Stack flex="1" gap={4}>
          <Alert severity="info">
            <Typography variant="labelMedium">
              {t('badge.model.create.uiBasics.customFields.hint')}
            </Typography>
          </Alert>

          <ModelNameField allowVariables />

          <ModelDescriptionField allowVariables />

          <BadgeModelLogoField />
        </Stack>

        <Stack flex="1">
          <BadgeModelCreationPreview />
        </Stack>
      </SectionContainer>

      <AdditionConfiguration />

      <CustomFieldsConfiguration />
    </>
  )
}
