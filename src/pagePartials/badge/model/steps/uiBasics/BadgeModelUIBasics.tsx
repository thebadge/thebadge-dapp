import React from 'react'

import { Divider, Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import useControllerTypeParam from '@/src/hooks/nextjs/useControllerTypeParam'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import BadgeConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/badge/BadgeConfiguration'
import DiplomaConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/diploma/DiplomaConfiguration'
import { BadgeModelControllerType, BadgeModelTemplate } from '@/types/badges/BadgeModel'

export const BADGE_MODEL_TEXT_CONTRAST: { [key: string]: string } = {
  White: 'dark-withTextBackground',
  Black: 'light-withTextBackground',
}

export const BADGE_MODEL_BACKGROUNDS: { [key: string]: string } = {
  'Rainbow Vortex':
    'https://images.unsplash.com/photo-1620421680010-0766ff230392?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=749&q=80',
  'White Waves':
    'https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  Calm: 'https://images.unsplash.com/photo-1579546928686-286c9fbde1ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjA5fHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  'Neon Storm':
    'https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  'Mountain Sea':
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
  'Purple Lava':
    'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=536&q=80',
}

export default function BadgeModelUIBasics() {
  const controllerType = useControllerTypeParam()
  const isThirdParty = controllerType === BadgeModelControllerType.ThirdParty

  const { control, watch } = useFormContext<CreateCommunityModelSchemaType>()
  const watchedTemplate = watch('template')

  return (
    <>
      {isThirdParty && (
        <Stack flex="1" gap={1} mb={4}>
          <Typography variant="bodySmall">Choose what type of badge you want:</Typography>

          <Controller
            control={control}
            name={'template'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DropdownSelect
                disabled={!isThirdParty}
                error={error}
                onChange={onChange}
                options={[BadgeModelTemplate.Classic, BadgeModelTemplate.Diploma]}
                value={value || BadgeModelTemplate.Classic}
              />
            )}
          />

          <Divider />
        </Stack>
      )}

      {watchedTemplate === BadgeModelTemplate.Classic && <BadgeConfiguration />}
      {watchedTemplate === BadgeModelTemplate.Diploma && <DiplomaConfiguration />}

      <Divider />
    </>
  )
}
