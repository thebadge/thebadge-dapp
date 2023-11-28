import React from 'react'

import { Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import HowItWorksStep from '@/src/components/common/HowItWorksStep'
import { AgreementCheckbox } from '@/src/components/form/formFields/AgreementCheckbox'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import { Creator } from '@/types/badges/Creator'

export default function HowItWorksThirdParty() {
  const { t } = useTranslation()
  const { control } = useFormContext<MintThirdPartySchemaType>() // retrieve all hook methods

  const { badgeModelId, contract } = useModelIdParam()
  const template = useBadgeModelTemplate(badgeModelId, contract)
  const badgeModelData = useBadgeModel(badgeModelId, contract)

  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeModelData.data?.badgeModel?.creator.metadataUri || '',
  )

  if (!badgeCreatorMetadata) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  return (
    <Stack>
      <Stack gap={6}>
        <HowItWorksStep
          index={1}
          text={t(`badge.model.mint.thirdParty.helpSteps.${0}`, {
            badgeModelTemplate: template,
          })}
        />
        <HowItWorksStep
          index={2}
          text={t(`badge.model.mint.thirdParty.helpSteps.${1}`, {
            badgeModelTemplate: template,
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
