import React from 'react'

import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { AgreementField } from '@/src/components/form/formFields/AgreementField'
import { DOCS_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { isTestnet } from '@/src/utils/network'
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

  return (
    <Controller
      control={control}
      name={'terms'}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <AgreementField
          agreementText={t('badge.model.mint.helpSteps', {
            badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
            badgeCreatorProfileLink: generateProfileUrl({
              address: badgeModelData.data?.badgeModel?.creator.id,
            }),
            curationDocsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
            timeUnit: isTestnet ? 'minutes' : 'days',
          })}
          color="blue"
          error={error}
          onChange={onChange}
          value={value}
        />
      )}
    />
  )
}
