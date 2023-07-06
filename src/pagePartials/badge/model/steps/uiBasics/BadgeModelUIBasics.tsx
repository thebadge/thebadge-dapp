import React from 'react'

import { Box, Stack, alpha, styled } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import { DropdownSelect } from '@/src/components/form/DropdownSelect'
import { ImageInput } from '@/src/components/form/ImageInput'
import { TextArea } from '@/src/components/form/TextArea'
import { TextField } from '@/src/components/form/TextField'
import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'

const BoxShadow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  filter: `drop-shadow(0px 0px 15px ${alpha(theme.palette.text.primary, 0.3)})`,
}))

export const BADGE_MODEL_TEXT_CONTRAST: { [key: string]: string } = {
  Black: 'light',
  White: 'dark',
  'White with shadow': 'dark-withTextBackground',
  'Black with shadow': 'light-withTextBackground',
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
  const { t } = useTranslation()
  const { control, watch } = useFormContext<CreateModelSchemaType>()

  const watchedName = watch('name')
  const watchedDescription = watch('description')
  const watchedLogoUri = watch('badgeModelLogoUri')
  const watchedTextContrast = watch('textContrast')
  const watchedBackground = watch('backgroundImage')

  return (
    <>
      <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
        <Stack flex="1" gap={2}>
          <Controller
            control={control}
            name={'name'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                label={t('badge.model.create.uiBasics.name')}
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name={'description'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextArea
                error={error}
                label={t('badge.model.create.uiBasics.description')}
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name={'badgeModelLogoUri'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ImageInput
                error={error}
                label={t('badge.model.create.uiBasics.logo')}
                onChange={(value: ImageType | null) => {
                  if (value) {
                    // We change the structure a little bit to have it ready to push to the backend
                    onChange({
                      mimeType: value.file?.type,
                      base64File: value.base64File,
                    })
                  } else onChange(null)
                }}
                value={value}
              />
            )}
          />
        </Stack>
        <Stack flex="1">
          <BoxShadow>
            <BadgePreview
              animationEffects={['wobble', 'grow', 'glare']}
              animationOnHover
              badgeBackgroundUrl={BADGE_MODEL_BACKGROUNDS[watchedBackground]}
              badgeUrl="https://www.thebadge.xyz"
              description={watchedDescription}
              imageUrl={watchedLogoUri?.base64File}
              size="medium"
              textContrast={BADGE_MODEL_TEXT_CONTRAST[watchedTextContrast]}
              title={watchedName}
            />
          </BoxShadow>
        </Stack>
      </Box>
      <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between" mt={4}>
        <Stack flex="1" gap={2}>
          <Controller
            control={control}
            name={'textContrast'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DropdownSelect
                error={error}
                label={t('badge.model.create.uiBasics.textContrast')}
                onChange={onChange}
                options={Object.keys(BADGE_MODEL_TEXT_CONTRAST)}
                value={value || 'Black'}
              />
            )}
          />
          <Controller
            control={control}
            name={'backgroundImage'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DropdownSelect
                error={error}
                label={t('badge.model.create.uiBasics.backgroundImage')}
                onChange={onChange}
                options={Object.keys(BADGE_MODEL_BACKGROUNDS)}
                value={value || 'Two'}
              />
            )}
          />
        </Stack>
        <Stack flex="1" gap={2}>
          <Controller
            control={control}
            name={'template'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DropdownSelect
                disabled
                error={error}
                label={t('badge.model.create.uiBasics.template')}
                onChange={onChange}
                options={['Classic', 'Business', 'Product', 'Academic', 'Fashion']}
                value={value || 'Classic'}
              />
            )}
          />
        </Stack>
      </Box>
    </>
  )
}
