import { useRef } from 'react'
import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { CustomFormFromSchemaWithoutSubmit } from '@/src/components/form/customForms/CustomForm'
import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useBadgeModelThirdPartyMetadata } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import { generateAutofilledValues } from '@/src/utils/badges/mintHelpers'
import { ReplacementKeys } from '@/src/utils/enrichTextWithValues'

const useDisplayRequiredDataInput = (badgeModelId: string): boolean => {
  const requiredBadgeDataMetadata = useBadgeModelThirdPartyMetadata(badgeModelId)

  const hasRequiredData = !!requiredBadgeDataMetadata.data?.requirementsData?.requirementsColumns

  if (!hasRequiredData) return false

  const iterableRequirementsColumns =
    requiredBadgeDataMetadata.data?.requirementsData.requirementsColumns || []

  let requiredInput = false
  for (const iterator of iterableRequirementsColumns) {
    if (!iterator.isAutoFillable) {
      requiredInput = true
      break
    }
  }

  return requiredInput
}

export default function DynamicRequiredData({
  onBackCallback,
  onNextCallback,
}: {
  onNextCallback: VoidFunction
  onBackCallback: VoidFunction
}) {
  const { t } = useTranslation()
  const formButtonRef = useRef<HTMLButtonElement>()
  const { setValue, watch } = useFormContext<MintThirdPartySchemaType>()
  const { badgeModelId, contract } = useModelIdParam()
  const { data: badgeModelData } = useBadgeModel(badgeModelId, contract)
  const expirationTime = badgeModelData?.badgeModel.validFor
  const destination = watch('destination')

  const requiredBadgeDataMetadata = useBadgeModelThirdPartyMetadata(badgeModelId)

  const hasRequiredData = useDisplayRequiredDataInput(badgeModelId)

  const RequiredDataSchema = z.object(
    klerosSchemaFactory(
      requiredBadgeDataMetadata.data?.requirementsData?.requirementsColumns || [],
    ),
  )

  const handleSubmitNext = (data: z.infer<typeof RequiredDataSchema>) => {
    const autoFilledData = generateAutofilledValues(
      {
        [ReplacementKeys.address]: destination,
        [ReplacementKeys.issueDate]: dayjs().format('DD/MM/YYYY'),
        [ReplacementKeys.expirationDate]: expirationTime
          ? dayjs().add(expirationTime, 'seconds').format('DD/MM/YYYY')
          : t('badge.viewBadge.neverExpires'),
      },
      requiredBadgeDataMetadata.data?.requirementsData?.requirementsColumns || [],
    )
    // We set the data collected on the 2dn form as evidence on the main one, so it will be stored
    // when onNextCallback is executed
    setValue('requiredData', {
      ...data,
      ...autoFilledData,
    })
    onNextCallback()
  }

  // We watch the main form that handle all the data and also fetch the stored data, so each time that
  // the dynamic form need to be re-rendered, it will have the user data bc the main form store it on LocalStorage
  const requiredDataStored = watch('requiredData')

  return (
    <Stack gap={2}>
      {hasRequiredData && (
        <Typography align={'center'} variant="dAppTitle1">
          {t('badge.model.mint.thirdParty.evidence.additionalData')}
        </Typography>
      )}

      <CustomFormFromSchemaWithoutSubmit
        defaultValues={requiredDataStored}
        formProps={{
          containerSx: { p: '0 !important', minHeight: '50vh' },
          buttonsSx: { marginTop: 'auto' },
          layout: 'flex',
          submitButton: {
            label: 'Next',
            ref: formButtonRef,
          },
          backButton: {
            label: 'Back',
            disabled: false,
          },
          onBack: onBackCallback,
          color: 'blue',
          displayFormInputs: hasRequiredData,
        }}
        onSubmit={handleSubmitNext}
        schema={RequiredDataSchema}
      />
    </Stack>
  )
}
