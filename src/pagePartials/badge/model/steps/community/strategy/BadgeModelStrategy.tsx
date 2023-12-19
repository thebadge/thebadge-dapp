import React from 'react'

import { Box, Stack, Typography, styled } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { Controller, useFormContext } from 'react-hook-form'

import { ExpirationField } from '@/src/components/form/formFields/ExpirationField'
import { PeriodSelector } from '@/src/components/form/formFields/PeriodSelector'
import { SeveritySelector } from '@/src/components/form/formFields/SeveritySelector'
import { TokenInput } from '@/src/components/form/formFields/TokenInput'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getNetworkConfig } from '@/src/config/web3'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

const SliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}))

const Label = styled(Typography)(({ theme }) => ({
  maxWidth: '175px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'none',
  },
}))

export default function BadgeModelStrategy() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreateCommunityModelSchemaType>()
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)

  return (
    <Stack gap={8}>
      <SliderContainer>
        <Label variant="bodySmall">Select the duration period for your badge model challenge</Label>
        <Controller
          control={control}
          name={'challengePeriodDuration'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <PeriodSelector
              error={error}
              maxValue={90}
              minValue={2}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </SliderContainer>
      <Controller
        control={control}
        name={'rigorousness'}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <SafeSuspense>
              <SeveritySelector error={error} onChange={onChange} value={value} />
            </SafeSuspense>
          )
        }}
      />

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
        <Stack flex="1" gap={1} justifyContent="flex-end">
          <Typography variant="bodySmall">
            How much do you want to charge for each badge?
          </Typography>

          <Controller
            control={control}
            name={'mintFee'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TokenInput
                decimals={18}
                error={error}
                hiddenBalance={true}
                onChange={onChange}
                symbol={networkConfig.token}
                value={value}
              />
            )}
          />
        </Stack>
      </Box>
    </Stack>
  )
}
