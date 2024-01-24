import React from 'react'

import { Skeleton } from '@mui/material'
import { useFormContext } from 'react-hook-form'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { ThirdPartyDefaultModelConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import BadgeClassicCreationPreview from '@/src/pagePartials/badge/model/steps/uiBasics/badge/BadgeClassicCreationPreview'
import DiplomaCreationPreview from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/DiplomaCreationPreview'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

export default function BadgeModelCreationPreview() {
  const { watch } = useFormContext<ThirdPartyDefaultModelConfigurationSchemaType>()

  const watchedTemplate = watch('template')

  if (watchedTemplate === BadgeModelTemplate.Diploma) {
    return (
      <SafeSuspense
        fallback={
          <Skeleton
            animation="wave"
            height={400}
            sx={{ m: 'auto' }}
            variant="rounded"
            width={655}
          />
        }
      >
        <DiplomaCreationPreview />
      </SafeSuspense>
    )
  }
  return <BadgeClassicCreationPreview />
}
