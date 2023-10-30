import React from 'react'

import { Box, Divider, Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { ExpirationField } from '@/src/components/form/formFields/ExpirationField'
import { PeriodSelector } from '@/src/components/form/formFields/PeriodSelector'
import { TokenInput } from '@/src/components/form/formFields/TokenInput'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getNetworkConfig } from '@/src/config/web3'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import RequirementInput from '@/src/pagePartials/badge/model/steps/strategy/RequirementInput'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SeveritySelector } from 'src/components/form/formFields/SeveritySelector'

export default function BadgeModelStrategy() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreateCommunityModelSchemaType>()
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
            label={t('badge.model.create.strategy.challengePeriodDuration')}
            maxValue={90}
            minValue={2}
            onChange={onChange}
            value={value}
          />
        )}
      />
      <Divider />
      <Controller
        control={control}
        name={'rigorousness'}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <SafeSuspense>
              <SeveritySelector
                error={error}
                label={t('badge.model.create.strategy.rigorousness')}
                onChange={onChange}
                value={value}
              />
            </SafeSuspense>
          )
        }}
      />

      <Divider />

      <Box
        display="flex"
        flexDirection="row"
        gap={5}
        justifyContent="space-between"
        paddingBottom={2}
      >
        <Stack flex="1" gap={4}>
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

      <Divider />

      <RequirementInput />
    </>
  )
}
