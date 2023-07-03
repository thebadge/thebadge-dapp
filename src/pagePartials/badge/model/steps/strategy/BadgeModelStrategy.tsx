import React from 'react'

import { Box, Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { ExpirationField } from '@/src/components/form/ExpirationField'
import { PeriodSelector } from '@/src/components/form/PeriodSelector'
import { SeveritySelector } from '@/src/components/form/SeveritySelector'
import { TokenInput } from '@/src/components/form/TokenInput'
import { getNetworkConfig } from '@/src/config/web3'
import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import RequirementInput from '@/src/pagePartials/badge/model/steps/strategy/RequirementInput'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function BadgeModelStrategy() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreateModelSchemaType>()
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)

  return (
    <>
      <Controller
        control={control}
        name={'challengePeriodDuration'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <PeriodSelector
            error={error}
            label={'Challenge period duration'}
            maxValue={90}
            minValue={2}
            onChange={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name={'rigorousness'}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <SeveritySelector
              error={error}
              label={'Rigorousness'}
              onChange={onChange}
              value={value}
            />
          )
        }}
      />
      <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
        <Stack flex="1" gap={4}>
          <Controller
            control={control}
            name={'validFor'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ExpirationField
                error={error}
                label={'Expiration time'}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
        <Stack flex="1" gap={4} justifyContent="flex-end">
          <Controller
            control={control}
            name={'mintCost'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TokenInput
                decimals={18}
                error={error}
                hiddenBalance={true}
                label={'Mint const'}
                onChange={onChange}
                symbol={networkConfig.token}
                value={value}
              />
            )}
          />
        </Stack>
      </Box>
      <RequirementInput />
    </>
  )
}
