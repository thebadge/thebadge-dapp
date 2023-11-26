import React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Stack, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import SectionContainer from '../addons/SectionContainer'
import { ImageInput } from '@/src/components/form/formFields/ImageInput'
import { TextArea } from '@/src/components/form/formFields/TextArea'
import { TextField } from '@/src/components/form/formFields/TextField'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import BadgeModelCreationPreview from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelCreationPreview'
import AdditionConfiguration from '@/src/pagePartials/badge/model/steps/uiBasics/badge/addons/AdditionalConfiguration'

export default function BadgeConfiguration() {
  const { t } = useTranslation()

  const { control } = useFormContext<CreateCommunityModelSchemaType>()

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
          <BadgeModelCreationPreview />
        </Stack>
      </SectionContainer>

      <AdditionConfiguration />
    </>
  )
}
