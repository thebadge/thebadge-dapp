import { useRef } from 'react'
import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { CustomFormFromSchemaWithoutSubmit } from '@/src/components/form/customForms/CustomForm'
import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import { ThirdPartyMetadataColumn } from '@/types/kleros/types'

export default function DynamicRequiredData({
  onBackCallback,
  onNextCallback,
}: {
  onNextCallback: VoidFunction
  onBackCallback: VoidFunction
}) {
  const formButtonRef = useRef<HTMLButtonElement>()
  const { setValue, watch } = useFormContext<MintThirdPartySchemaType>()

  // TODO Remove hardcoded hash, get it from SG
  const requiredBadgeDataMetadata = useS3Metadata<{
    content: { requirementsColumns: ThirdPartyMetadataColumn[] }
  }>('QmdXRHPWh4atF97AshCAjfwkwhUWEhSXNK34THnJrhk7UR')

  const hasRequiredData = !!requiredBadgeDataMetadata.data?.content.requirementsColumns

  const RequiredDataSchema = z.object(
    klerosSchemaFactory(requiredBadgeDataMetadata.data?.content.requirementsColumns || []),
  )

  const handleSubmitNext = (data: z.infer<typeof RequiredDataSchema>) => {
    // We set the data collected on the 2dn form as evidence on the main one, so it will be stored
    // when onNextCallback is executed
    setValue('requiredData', data)
    onNextCallback()
  }

  // We watch the main form that handle all the data and also fetch the stored data, so each time that
  // the dynamic form need to be re-rendered, it will have the user data bc the main form store it on LocalStorage
  const requiredDataStored = watch('requiredData')

  return (
    <Stack gap={2}>
      {hasRequiredData && (
        <Typography align={'center'} variant="dAppTitle1">
          Needed information about your user
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
        }}
        onSubmit={handleSubmitNext}
        schema={RequiredDataSchema}
      />
    </Stack>
  )
}
