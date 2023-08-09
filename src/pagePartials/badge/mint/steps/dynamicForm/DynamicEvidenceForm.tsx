import { useRef } from 'react'
import * as React from 'react'

import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { CustomFormFromSchemaWithoutSubmit } from '@/src/components/form/customForms/CustomForm'
import klerosSchemaFactory from '@/src/components/form/helpers/validators'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'

export default function DynamicForm({
  onBackCallback,
  onNextCallback,
}: {
  onNextCallback: VoidFunction
  onBackCallback: VoidFunction
}) {
  const formButtonRef = useRef<HTMLButtonElement>()
  const { setValue, watch } = useFormContext<MintBadgeSchemaType>()

  const modelId = useModelIdParam()

  const badgeModelKleros = useRegistrationBadgeModelKlerosMetadata(modelId)
  const klerosBadgeMetadata = badgeModelKleros.data?.badgeModelKlerosRegistrationMetadata
  if (!klerosBadgeMetadata) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const CreateBadgeSchema = z.object(klerosSchemaFactory(klerosBadgeMetadata.metadata.columns))

  const handleSubmitNext = (data: z.infer<typeof CreateBadgeSchema>) => {
    // We set the data collected on the 2dn form as evidence on the main one, so it will be stored
    // when onNextCallback is executed
    setValue('evidence', data)
    onNextCallback()
  }

  // We watch the main form that handle all the data and also fetch the stored data, so each time that
  // the dynamic form need to be re-rendered, it will have the user data bc the main form store it on LocalStorage
  const evidenceStored = watch('evidence')

  return (
    <CustomFormFromSchemaWithoutSubmit
      defaultValues={evidenceStored}
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
      schema={CreateBadgeSchema}
    />
  )
}
