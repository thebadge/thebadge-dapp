import * as React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { TextField } from '@/src/components/form/formFields/TextField'
import { ClaimThirdPartyBadgeSchemaType } from '@/src/pagePartials/badge/claim/schema/ClaimThirdPartyBadgeSchema'

export const StepClaimThirdParty = () => {
  const { t } = useTranslation()
  const { control } = useFormContext<ClaimThirdPartyBadgeSchemaType>()
  return (
    <Stack gap={2}>
      <Typography variant="dAppTitle1">{t('badge.model.claim.thirdParty.body.title')}</Typography>
      <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
        <Stack flex="2" gap={2} justifyContent="space-between">
          <Controller
            control={control}
            name={'claimAddress'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={error}
                label={t('badge.model.claim.thirdParty.body.addressPlaceholder')}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
      </Box>
    </Stack>
  )
}
