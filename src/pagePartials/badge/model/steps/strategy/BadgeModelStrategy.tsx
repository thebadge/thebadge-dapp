import React, { ChangeEvent } from 'react'

import { Box, Stack, TextField } from '@mui/material'
import { BigNumberInput } from 'big-number-input'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import { ExpirationField } from '@/src/components/form/ExpirationField'
import { PeriodSelector } from '@/src/components/form/PeriodSelector'
import { SeveritySelector } from '@/src/components/form/SeveritySelector'
import { getNetworkConfig } from '@/src/config/web3'
import RequirementInput from '@/src/pagePartials/badge/model/steps/strategy/RequirementInput'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function BadgeModelStrategy() {
  const { t } = useTranslation()
  const { control, watch } = useFormContext()
  const { appChainId } = useWeb3Connection()
  const networkConfig = getNetworkConfig(appChainId)

  return (
    <>
      <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
        <Stack flex="1" gap={4}>
          <Controller
            control={control}
            name={'challengePeriodDuration'}
            render={({ field: { name, onChange, value }, fieldState: { error } }) => (
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
            render={({ field: { name, onChange, value }, fieldState: { error } }) => (
              <SeveritySelector
                error={error}
                label={'Rigorousness'}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
        <Stack flex="1" gap={4}>
          <Controller
            control={control}
            name={'mintCost'}
            render={({ field: { name, onChange, value }, fieldState: { error } }) => (
              <BigNumberInput
                decimals={8}
                onChange={onChange}
                renderInput={(props) => (
                  <Stack>
                    <TextField
                      color="secondary"
                      helperText={error?.message}
                      inputProps={{
                        min: 0,
                      }}
                      label={`Cost to mint in ${networkConfig.token}`}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        props.onChange && props.onChange(e)
                      }
                      placeholder="0.00"
                      value={props.value}
                      variant="standard"
                    />
                  </Stack>
                )}
                value={value || ''}
              />
            )}
          />
        </Stack>
      </Box>
      <RequirementInput />
      <Controller
        control={control}
        name={'validFor'}
        render={({ field: { name, onChange, value }, fieldState: { error } }) => (
          <ExpirationField
            error={error}
            label={'Expiration time'}
            onChange={onChange}
            value={value}
          />
        )}
      />
    </>
  )
}
