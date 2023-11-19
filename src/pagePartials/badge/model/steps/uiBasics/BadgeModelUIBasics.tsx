import React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Stack, Tooltip, Typography, alpha, styled } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import { ImageInput } from '@/src/components/form/formFields/ImageInput'
import { TextArea } from '@/src/components/form/formFields/TextArea'
import { TextField } from '@/src/components/form/formFields/TextField'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'

const BoxShadow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  filter: `drop-shadow(0px 0px 15px ${alpha(theme.palette.text.primary, 0.3)})`,
}))

const SectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(10),
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
}))

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
  const { t } = useTranslation()
  const { control, watch } = useFormContext<CreateCommunityModelSchemaType>()

  const watchedName = watch('name') || 'Security Certificate'
  const watchedDescription =
    watch('description') ||
    'This badges certifies that the address that has it complies with the regulations about...'
  const watchedLogoUri = watch('badgeModelLogoUri')
  const watchedTextContrast = watch('textContrast')
  const watchedBackground = watch('backgroundImage')

  return (
    <>
      <SectionContainer>
        <Stack flex="1" gap={4}>
          <Stack>
            <Typography variant="bodySmall">Choose a name for your badge model</Typography>
            <Controller
              control={control}
              name={'name'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  ghostLabel={t('badge.model.create.uiBasics.name')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>

          <Stack>
            <Typography variant="bodySmall">Briefly describe what your badge certifies</Typography>
            <Controller
              control={control}
              name={'description'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextArea
                  error={error}
                  onChange={onChange}
                  placeholder={t('badge.model.create.uiBasics.description')}
                  value={value}
                />
              )}
            />
          </Stack>

          <Stack sx={{ position: 'relative' }}>
            <Typography variant="bodySmall">
              Choose an image or logo that will make your model unique
            </Typography>
            <Controller
              control={control}
              name={'badgeModelLogoUri'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ImageInput
                  error={error}
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
            <Tooltip
              arrow
              title={
                'For your badge to look great, it is ideal that the image has 1:1 proportions.'
              }
            >
              <InfoOutlinedIcon sx={{ ml: 1, position: 'absolute', bottom: 8, right: 4 }} />
            </Tooltip>
          </Stack>
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
      </SectionContainer>
      <Box display="flex" flexDirection="row" gap={10} justifyContent="space-between" mt={4}>
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
