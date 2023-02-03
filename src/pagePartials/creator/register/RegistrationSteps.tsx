import * as React from 'react'

import { Avatar, Box, Stack, Typography } from '@mui/material'
import { z } from 'zod'

import { RegisterCuratorSchema } from '@/pages/creator/register'
import { DataGrid } from '@/src/components/form/customForms/type'
import { FormWithSteps } from '@/src/components/form/formWithSteps/FormWithSteps'
import {
  AvatarSchema,
  CheckBoxSchema,
  EmailSchema,
  LongTextSchema,
  TwitterSchema,
} from '@/src/components/form/helpers/customSchemas'

type RegistrationStepsProps = {
  onSubmit: (data: any) => void
}

const steps = ['Basic information.', 'How to contact you.', 'Agreement.']
// TODO Move both props out of the comp, this one should be re-usable
const formGridLayout: DataGrid[][] = [
  [
    { i: 'TextField', x: 0, y: 0, w: 3, h: 1, static: true },
    { i: 'TextArea', x: 0, y: 1, w: 3, h: 2, static: true },
    { i: 'AvatarInput', x: 3, y: 0, w: 3, h: 3, static: true },
  ],
  [
    { i: 'TextField', x: 0, y: 1, w: 3, h: 1, static: true },
    { i: 'TextField', x: 3, y: 1, w: 3, h: 1, static: true },
    { i: 'TextField', x: 0, y: 1, w: 3, h: 1, static: true },
    { i: 'TextField', x: 3, y: 1, w: 3, h: 1, static: true },
  ],
  [{ i: 'CheckBox', x: 0, y: 0, w: 12, h: 3, static: true }],
]

export const RegisterCuratorSchemaStep1 = z.object({
  name: z.string().describe('Your name // ??'),
  description: LongTextSchema.describe(
    'Description // Tell us about you, share some of you background with the community.',
  ),
  logo: AvatarSchema.describe('Profile photo // Upload a photo that identifies you.'), // Image Schema MUST BE the created one
})

export const RegisterCuratorSchemaStep2 = z.object({
  website: z.string().describe(`Website // ??`).optional(),
  twitter: TwitterSchema.describe(`Twitter // ??`).optional(),
  discord: z.string().describe(`Discord // ??`).optional(),
  email: EmailSchema.describe(`Email // ??`),
})

export const RegisterCuratorSchemaStep3 = z.object({
  terms: CheckBoxSchema.describe(`Terms & Conditions // ??`),
})

export default function RegistrationSteps({ onSubmit }: RegistrationStepsProps) {
  const handleOnSubmit = (data: z.infer<typeof RegisterCuratorSchema>) => {
    console.log(data)
    onSubmit(data)
  }

  function handleFormPreview(data: z.infer<typeof RegisterCuratorSchema>) {
    return (
      <Stack>
        <Typography variant="subtitle1">Please review your data</Typography>
        <Stack>
          <Typography variant="subtitle2">Creator Information</Typography>
          <Box display="flex" flexDirection="row">
            <Stack>
              <Typography variant="body1">{data.name}</Typography>
              <Typography variant="body1">{data.description}</Typography>
            </Stack>
            <Avatar>
              <img alt="" src={data.logo.data_url} width="150" />
            </Avatar>
          </Box>
          <Typography variant="subtitle2">Creator Contact</Typography>
          <Stack>
            <Typography variant="body1">{data.email}</Typography>

            {data.discord && <Typography variant="body1">{data.discord}</Typography>}
            {data.website && <Typography variant="body1">{data.website}</Typography>}
            {data.twitter && <Typography variant="body1">{data.twitter}</Typography>}
          </Stack>
        </Stack>
      </Stack>
    )
  }

  return (
    <FormWithSteps
      formGridLayout={formGridLayout}
      formLayout={'gridResponsive'}
      formSubmitReview={handleFormPreview}
      onSubmit={handleOnSubmit}
      stepNames={steps}
      stepSchemas={[
        RegisterCuratorSchemaStep1,
        RegisterCuratorSchemaStep2,
        RegisterCuratorSchemaStep3,
      ]}
    />
  )
}
