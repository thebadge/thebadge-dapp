import React from 'react'

import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { AgreementField } from '@/src/components/form/formFields/AgreementField'
import { DOCS_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import { secondsToDays, secondsToMinutes } from '@/src/utils/dateUtils'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { isTestnet } from '@/src/utils/network'
import { Creator } from '@/types/badges/Creator'

export default function HowItWorks() {
  const { t } = useTranslation()
  const { control } = useFormContext<MintBadgeSchemaType>() // retrieve all hook methods

  const modelId = useModelIdParam()
  const badgeModelData = useBadgeModel(modelId)
  const klerosBadgeModel = useRegistrationBadgeModelKlerosMetadata(modelId)

  const badgeModelKlerosMetadata = klerosBadgeModel.data?.badgeModelKlerosRegistrationMetadata
  const badgeCriteria = klerosBadgeModel.data?.badgeRegistrationCriteria
  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeModelData.data?.badgeModel?.creator.metadataUri || '',
  )

  if (!badgeCreatorMetadata || !badgeModelKlerosMetadata) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const challengePeriodDuration = isTestnet
    ? secondsToMinutes(klerosBadgeModel.data?.challengePeriodDuration)
    : secondsToDays(klerosBadgeModel.data?.challengePeriodDuration)

  return (
    <Controller
      control={control}
      name={'howItWorks'}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <AgreementField
          agreementText={t('badge.model.mint.helpSteps', {
            badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
            badgeCreatorProfileLink: generateProfileUrl({
              address: badgeModelData.data?.badgeModel?.creator.id,
            }),
            curationDocsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
            curationCriteriaUrl: badgeCriteria,
            challengePeriodDuration,
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
