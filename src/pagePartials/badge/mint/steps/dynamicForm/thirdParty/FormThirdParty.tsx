import * as React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import { TextField } from '@/src/components/form/formFields/TextField'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import {
  MINT_THIRD_PARTY_METHODS,
  MintThirdPartySchemaType,
} from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'

export default function FormThirdParty() {
  const { control, watch } = useFormContext<MintThirdPartySchemaType>()
  const { t } = useTranslation()
  const { badgeModelId } = useModelIdParam()
  const template = useBadgeModelTemplate(badgeModelId)

  const watchedPreferMintMethod = watch('preferMintMethod')

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
                options={[...MINT_THIRD_PARTY_METHODS]}
                value={value || 'email'}
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
