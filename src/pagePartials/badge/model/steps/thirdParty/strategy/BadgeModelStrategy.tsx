import React from 'react'

import { Box, Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { ExpirationField } from '@/src/components/form/formFields/ExpirationField'
import { TextField } from '@/src/components/form/formFields/TextField'
import { TokenInput } from '@/src/components/form/formFields/TokenInput'
import { getNetworkConfig } from '@/src/config/web3'
import { CreateThirdPartyModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function BadgeModelStrategy() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreateThirdPartyModelSchemaType>()
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)

  // TODO: Add and input for array adding "administrators"
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap={5}
        justifyContent="space-between"
        paddingBottom={2}
      >
        <Stack flex="1">
          <Controller
            control={control}
            name={'validFor'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ExpirationField
                error={error}
                label={t('badge.model.create.strategy.validFor')}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>

        <Stack flex="1" justifyContent="flex-end">
          <Controller
            control={control}
            name={'administrators'}
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

        <Stack flex="1" gap={4} justifyContent="flex-end">
          <Controller
            control={control}
            name={'mintFee'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TokenInput
                decimals={18}
                error={error}
                hiddenBalance={true}
                label={t('badge.model.create.strategy.mintFee')}
                onChange={onChange}
                symbol={networkConfig.token}
                value={value}
              />
            )}
          />
        </Stack>
      </Box>
    </>
  )
}
