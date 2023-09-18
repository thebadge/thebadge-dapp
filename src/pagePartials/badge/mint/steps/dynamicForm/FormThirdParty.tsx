import * as React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import { TextField } from '@/src/components/form/formFields/TextField'
import {
  MINT_THIRD_PARTY_METHODS,
  MintThirdPartySchemaType,
} from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'

export default function FormThirdParty() {
  const { control, watch } = useFormContext<MintThirdPartySchemaType>()

  const watchedPreferMintMethod = watch('preferMintMethod')
  return (
    <>
      <Stack gap={2}>
        <Typography align={'center'} variant="dAppTitle1">
          Issue a badge to your user
        </Typography>
        <Controller
          control={control}
          name={'preferMintMethod'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Box alignItems="center" display="flex" gap={1} justifyContent="left">
              <Typography>Choose the method to send the badge to your user</Typography>
              <DropdownSelect
                error={error}
                onChange={onChange}
                options={[...MINT_THIRD_PARTY_METHODS]}
                value={value || 'email'}
              />
            </Box>
          )}
        />
        {watchedPreferMintMethod === 'address' ? (
          <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
            <Controller
              control={control}
              name={'address'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={'Users ethereum address'}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Box>
        ) : (
          <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
            <Stack flex="1" gap={2}>
              <Controller
                control={control}
                name={'email'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField
                    error={error}
                    label={'Users email'}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </Stack>
          </Box>
        )}
      </Stack>
    </>
  )
}
