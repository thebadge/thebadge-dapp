import React from 'react'

import { Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import HowItWorksStep from '@/src/components/common/HowItWorksStep'
import { AgreementCheckbox } from '@/src/components/form/formFields/AgreementCheckbox'
import { DOCUMENTATION_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import { Creator } from '@/types/badges/Creator'

export default function HowItWorksThirdParty() {
  const { t } = useTranslation()
  const { control } = useFormContext<MintThirdPartySchemaType>() // retrieve all hook methods

  const modelId = useModelIdParam()
  const badgeModelData = useBadgeModel(modelId)

  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeModelData.data?.badgeModel?.creator.metadataUri || '',
  )

  if (!badgeCreatorMetadata) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  // TODO Define wording for third party
  return (
    <Stack>
      <Stack gap={6}>
        <HowItWorksStep
          index={1}
          text={t(`badge.model.mint.helpSteps.${0}`, {
            badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
            badgeCreatorProfileLink: '/profile/' + badgeModelData.data?.badgeModel?.creator.id,
          })}
        />
        <HowItWorksStep
          index={2}
          text={t(`badge.model.mint.helpSteps.${1}`, {
            curationDocsUrl: DOCUMENTATION_URL + '/protocol-mechanics/challenge',
          })}
        />
      </Stack>
      <Controller
        control={control}
        name={'terms'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <AgreementCheckbox color="blue" error={error} onChange={onChange} value={value} />
        )}
      />
    </Stack>
  )
}
