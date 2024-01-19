import * as React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import { TextField } from '@/src/components/form/formFields/TextField'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import useTpBadgeModelMintMethods from '@/src/hooks/theBadge/useTpBadgeModelMintMethods'
import { MintThirdPartySchemaType } from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'

export default function FormThirdParty() {
  const { control, watch } = useFormContext<MintThirdPartySchemaType>()
  const { t } = useTranslation()
  const { badgeModelId } = useModelIdParam()
  const template = useBadgeModelTemplate(badgeModelId)
  const mintMethods = useTpBadgeModelMintMethods(badgeModelId)
  const defaultMintMethod = mintMethods[0]
  const watchedPreferMintMethod = watch('preferMintMethod') || defaultMintMethod

  return (
    <>
      <Stack gap={2}>
        <Typography align={'center'} variant="dAppTitle1">
          {t('badge.model.mint.thirdParty.evidence.title', {
            badgeModelTemplate: template,
          })}
        </Typography>
        <Controller
          control={control}
          defaultValue={defaultMintMethod}
          name={'preferMintMethod'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Box alignItems="center" display="flex" gap={1} justifyContent="left">
              <Typography>
                {t('badge.model.mint.thirdParty.evidence.sendMethodText', {
                  badgeModelTemplate: template,
                })}
              </Typography>
              <DropdownSelect
                error={error}
                onChange={onChange}
                options={[...mintMethods]}
                value={value || defaultMintMethod}
              />
            </Box>
          )}
        />

        <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
          <Controller
            control={control}
            name={'destination'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                label={
                  watchedPreferMintMethod === 'address' ? 'Users ethereum address' : 'Users email'
                }
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Box>
      </Stack>
    </>
  )
}
