import React from 'react'

import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { AgreementField } from '@/src/components/form/formFields/AgreementField'
import { DISCORD_URL, DOCS_URL } from '@/src/constants/common'
import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'

export default function HowItWorks() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreateModelSchemaType>() // retrieve all hook methods

  return (
    <Controller
      control={control}
      name={'howItWorks'}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <AgreementField
          agreementText={t('badge.model.create.helpSteps', {
            curationCriteriaDocsUrl:
              DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
            curationCriteriaStandardDocsUrl:
              DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
            termsUrls: '/terms',
            docsUrl: DOCS_URL,
            discordUrl: DISCORD_URL,
          })}
          error={error}
          onChange={onChange}
          value={value}
        />
      )}
    />
  )
}
