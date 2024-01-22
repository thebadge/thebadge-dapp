import React from 'react'

import { Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import SectionContainer from '../addons/SectionContainer'
import { TextArea } from '@/src/components/form/formFields/TextArea'
import { TextField } from '@/src/components/form/formFields/TextField'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import BadgeModelCreationPreview from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelCreationPreview'
import BodyDataConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/BodyDataConfiguration'
import FooterConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/FooterConfiguration'
import HeaderConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/HeaderConfiguration'
import IssuerConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/IssuerConfiguration'
import SignatureConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/addons/SignatureConfiguration'

export default function DiplomaConfiguration() {
  const { t } = useTranslation()

  const { control } = useFormContext<CreateCommunityModelSchemaType>()

  return (
    <>
      <SectionContainer>
        <Stack flex="1" gap={4}>
          <Stack>
            <Typography variant="bodySmall">
              {t('badge.model.create.uiBasics.templateConfig.title') + ' *'}
            </Typography>
            <Controller
              control={control}
              name={'name'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  ghostLabel={t('badge.model.create.uiBasics.name')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>

          <Stack>
            <Typography variant="bodySmall">
              {t('badge.model.create.uiBasics.templateConfig.description') + ' *'}
            </Typography>
            <Controller
              control={control}
              name={'description'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextArea
                  error={error}
                  onChange={onChange}
                  placeholder={t('badge.model.create.uiBasics.description')}
                  value={value}
                />
              )}
            />
          </Stack>
        </Stack>
      </SectionContainer>
      <Divider />

      <Stack flex="1" mb={2}>
        <BadgeModelCreationPreview />
      </Stack>

      <BodyDataConfiguration />

      <HeaderConfiguration />

      <SafeSuspense>
        <FooterConfiguration />
      </SafeSuspense>

      <SignatureConfiguration />

      <SafeSuspense>
        <IssuerConfiguration />
      </SafeSuspense>
    </>
  )
}
