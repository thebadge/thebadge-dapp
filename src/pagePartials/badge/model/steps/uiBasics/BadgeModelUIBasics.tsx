import React from 'react'

import { Divider } from '@mui/material'
import { useFormContext } from 'react-hook-form'

import { ThirdPartyDefaultModelConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import BadgeConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/badge/BadgeConfiguration'
import DiplomaConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/DiplomaConfiguration'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

export default function BadgeModelUIBasics() {
  const { watch } = useFormContext<ThirdPartyDefaultModelConfigurationSchemaType>()
  const watchedTemplate = watch('template')

  return (
    <>
      {watchedTemplate === BadgeModelTemplate.Badge && <BadgeConfiguration />}
      {watchedTemplate === BadgeModelTemplate.Diploma && <DiplomaConfiguration />}

      <Divider />
    </>
  )
}
