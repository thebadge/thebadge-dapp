import React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Stack, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import { ImageInput } from '@/src/components/form/formFields/ImageInput'
import { CreateThirdPartyBadgeModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'

export default function BadgeModelLogoField() {
  const { t } = useTranslation()

  const { control } = useFormContext<CreateThirdPartyBadgeModelSchemaType>()

  return (
    <Stack sx={{ position: 'relative' }}>
      <Typography variant="bodySmall">
        {t('badge.model.create.uiBasics.templateConfig.logoDescription') + ' *'}
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
      <Tooltip arrow title={t('badge.model.create.uiBasics.templateConfig.logoTooltip')}>
        <InfoOutlinedIcon sx={{ ml: 1, position: 'absolute', bottom: 8, right: 4 }} />
      </Tooltip>
    </Stack>
  )
}
