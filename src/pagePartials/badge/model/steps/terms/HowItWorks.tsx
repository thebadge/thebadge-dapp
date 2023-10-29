import React from 'react'

import { Stack } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { Controller, useFormContext } from 'react-hook-form'

import HowItWorksStep from '@/src/components/common/HowItWorksStep'
import { AgreementCheckbox } from '@/src/components/form/formFields/AgreementCheckbox'
import { DISCORD_URL, DOCS_URL, DOCUMENTATION_URL } from '@/src/constants/common'
import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'

export default function HowItWorks() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreateModelSchemaType>() // retrieve all hook methods

  return (
    <Stack gap={8} mt={4}>
      <Stack gap={6}>
        <HowItWorksStep index={1} text={t(`badge.model.create.helpSteps.${0}`)} />
        <HowItWorksStep
          index={2}
          text={t(`badge.model.create.helpSteps.${1}`, {
            curationCriteriaDocsUrl: DOCUMENTATION_URL + '/protocol-mechanics/challenge',
          })}
        />
        <HowItWorksStep
          index={3}
          text={t(`badge.model.create.helpSteps.${2}`, {
            // TODO Update url (we need to write this docs)
            curationCriteriaStandardDocsUrl: DOCUMENTATION_URL + '/protocol-mechanics/challenge',
            termsUrls: '/terms',
          })}
        />
        <HowItWorksStep
          index={4}
          text={t(`badge.model.create.helpSteps.${3}`, {
            docsUrl: DOCS_URL,
            discordUrl: DISCORD_URL,
          })}
        />
      </Stack>
      <Controller
        control={control}
        name={'howItWorks'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <AgreementCheckbox error={error} onChange={onChange} value={value} />
        )}
      />
    </Stack>
  )
}
