import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Container, Divider, Stack, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import StepPrompt from '@/src/components/form/formWithSteps/StepPrompt'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import { TransactionStates } from '@/src/hooks/useTransaction'
import {
  CreatorRegisterSchema,
  CreatorRegisterSchemaType,
} from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import StepHeader from '@/src/pagePartials/creator/register/steps/StepHeader'
import AccountDetails from '@/src/pagePartials/creator/register/steps/generalInfo/AccountDetails'
import ContactInformation from '@/src/pagePartials/creator/register/steps/generalInfo/ContactInformation'
import TermsAndConditions from '@/src/pagePartials/creator/register/steps/terms/TermsAndConditions'
import { PreventActionWithoutConnection } from '@/src/pagePartials/errors/preventActionWithoutConnection'

type RegistrationStepsProps = {
  onSubmit: SubmitHandler<CreatorRegisterSchemaType>
  txState: TransactionStates
  resetTxState: VoidFunction
}

export const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.25),
  fontSize: '14px !important',
  minHeight: '30px',
}))

export default function RegistrationWithSteps({
  onSubmit,
  resetTxState,
  txState = TransactionStates.none,
}: RegistrationStepsProps) {
  const { t } = useTranslation()

  const methods = useForm<z.infer<typeof CreatorRegisterSchema>>({
    resolver: zodResolver(CreatorRegisterSchema),
    defaultValues: {
      preferContactMethod: 'email',
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  return (
    <FormProvider {...methods}>
      <StepPrompt hasUnsavedChanges={methods.formState.isDirty} />
      <StepHeader />
      <Container maxWidth="md" sx={{ minHeight: '50vh' }}>
        {txState !== TransactionStates.none && txState !== TransactionStates.success && (
          <TransactionLoading resetTxState={resetTxState} state={txState} />
        )}
        {txState === TransactionStates.none && (
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack gap={5}>
              <AccountDetails />
              <ContactInformation />

              <TermsAndConditions />

              <Stack gap={4} mt={4}>
                <Divider color={colors.white} />

                <PreventActionWithoutConnection sx={{ m: 'auto' }}>
                  <SubmitButton color="purple" sx={{ m: 'auto' }} type="submit" variant="contained">
                    {t('creator.register.submit')}
                  </SubmitButton>
                </PreventActionWithoutConnection>
              </Stack>
            </Stack>
          </form>
        )}
      </Container>
    </FormProvider>
  )
}
