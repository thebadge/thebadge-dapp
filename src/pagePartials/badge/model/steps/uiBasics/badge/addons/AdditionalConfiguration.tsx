import React from 'react'

import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import {
  BADGE_MODEL_BACKGROUNDS,
  BADGE_MODEL_TEXT_CONTRAST,
} from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'

export default function AdditionConfiguration() {
  const { t } = useTranslation()

  const { control } = useFormContext<CreateCommunityModelSchemaType>()

  return (
    <>
      <Typography mt={2} variant="titleMedium">
        Additional configs
      </Typography>
      <SectionContainer>
        <Stack flex="1">
          <Controller
            control={control}
            name={'textContrast'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DropdownSelect
                error={error}
                label={t('badge.model.create.uiBasics.textContrast')}
                onChange={onChange}
                options={Object.keys(BADGE_MODEL_TEXT_CONTRAST)}
                value={value || 'Black'}
              />
            )}
          />
        </Stack>
        <Stack flex="1">
          <Controller
            control={control}
            name={'backgroundImage'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DropdownSelect
                error={error}
                label={t('badge.model.create.uiBasics.backgroundImage')}
                onChange={onChange}
                options={Object.keys(BADGE_MODEL_BACKGROUNDS)}
                value={value || 'Two'}
              />
            )}
          />
        </Stack>
      </SectionContainer>
    </>
  )
}
