import React, { useEffect } from 'react'

import { Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import useControllerTypeParam from '@/src/hooks/nextjs/useControllerTypeParam'
import { CreateThirdPartyModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import BadgeConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/badge/BadgeConfiguration'
import DiplomaConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/DiplomaConfiguration'
import { BadgeModelControllerType, BadgeModelTemplate } from '@/types/badges/BadgeModel'

export default function BadgeModelUIBasics() {
  const { t } = useTranslation()
  const controllerType = useControllerTypeParam()
  const isThirdParty = controllerType === BadgeModelControllerType.ThirdParty

  const { control, resetField, setValue, watch } = useFormContext<CreateThirdPartyModelSchemaType>()
  const watchedTemplate = watch('template')

  useEffect(() => {
    if (watchedTemplate === BadgeModelTemplate.Badge && isThirdParty) {
      // These fields are not used on this Model Template
      setValue('courseName', '')
    }
  }, [setValue, watchedTemplate, isThirdParty, resetField])

  return (
    <>
      {isThirdParty && (
        <Stack flex="1" gap={1} mb={4}>
          <Typography variant="bodySmall">
            {t('badge.model.create.uiBasics.templateConfig.badgeTypeSelectorTitle')}
          </Typography>

          <Controller
            control={control}
            name={'template'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DropdownSelect
                disabled={!isThirdParty}
                error={error}
                onChange={onChange}
                options={[BadgeModelTemplate.Badge, BadgeModelTemplate.Diploma]}
                value={value || BadgeModelTemplate.Badge}
              />
            )}
          />

          <Divider />
        </Stack>
      )}

      {watchedTemplate === BadgeModelTemplate.Badge && <BadgeConfiguration />}
      {watchedTemplate === BadgeModelTemplate.Diploma && <DiplomaConfiguration />}

      <Divider />
    </>
  )
}
