import React from 'react'

import { Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'

import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import AccountDetails from '@/src/pagePartials/creator/register/steps/generalInfo/AccountDetails'
import ContactInformation from '@/src/pagePartials/creator/register/steps/generalInfo/ContactInformation'

export default function RegisterStep() {
  const { control } = useFormContext<CreateCommunityModelSchemaType>() // retrieve all hook methods

  return (
    <Stack gap={8} mt={4}>
      <Stack gap={5}>
        <AccountDetails formControl={control} />
        <ContactInformation formControl={control} />
      </Stack>
    </Stack>
  )
}
