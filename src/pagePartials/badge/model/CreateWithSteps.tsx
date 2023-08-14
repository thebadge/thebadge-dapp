import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Stack } from '@mui/material'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import StepHeader from './steps/StepHeader'
import { FIELDS_TO_VALIDATE_ON_STEP, defaultValues } from './utils'
import StepPrompt from '@/src/components/form/formWithSteps/StepPrompt'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import { TransactionStates } from '@/src/hooks/useTransaction'
import { useTriggerRHF } from '@/src/hooks/useTriggerRHF'
import {
  CreateModelSchema,
  CreateModelSchemaType,
} from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import StepFooter from '@/src/pagePartials/badge/model/steps/StepFooter'
import BadgeModelEvidenceFormCreation from '@/src/pagePartials/badge/model/steps/evidence/BadgeModelEvidenceFormCreation'
import BadgeModelConfirmation from '@/src/pagePartials/badge/model/steps/preview/BadgeModelConfirmation'
import BadgeModelCreated from '@/src/pagePartials/badge/model/steps/preview/BadgeModelCreated'
import BadgeModelStrategy from '@/src/pagePartials/badge/model/steps/strategy/BadgeModelStrategy'
import HowItWorks from '@/src/pagePartials/badge/model/steps/terms/HowItWorks'
import BadgeModelUIBasics from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'

type CreateModelStepsProps = {
  onSubmit: SubmitHandler<CreateModelSchemaType>
  txState: TransactionStates
  resetTxState: VoidFunction
}

export default function CreateWithSteps({
  onSubmit,
  resetTxState,
  txState = TransactionStates.none,
}: CreateModelStepsProps) {
  const [currentStep, setCurrentStep] = useState(0)

  // Naive completed step implementation
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  const methods = useForm<z.infer<typeof CreateModelSchema>>({
    resolver: zodResolver(CreateModelSchema),
    defaultValues: defaultValues(),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const triggerValidation = useTriggerRHF(methods)
  async function isValidStep() {
    return await triggerValidation(FIELDS_TO_VALIDATE_ON_STEP[currentStep])
  }

  // Navigation helpers to go back on the steps
  async function onBackCallback() {
    setCurrentStep((prev) => (prev === 0 ? 0 : prev - 1))
  }

  // Navigation helpers to go to the next step
  async function onNextCallback() {
    const isValid = await isValidStep()
    if (isValid) {
      setCompleted((prev) => ({ ...prev, [currentStep]: true }))
      setCurrentStep((prev) => (prev === 4 ? 4 : prev + 1))
    }
  }

  // Navigation helpers to jump to a given number step
  async function onStepNavigation(stepNumber: number) {
    // Safeguard to prevent navigation on Transaction
    if (txState !== TransactionStates.none) return
    const isValid = await isValidStep()
    // Only allows one step further or to a completed steps
    if (isValid && (stepNumber <= currentStep + 1 || completed[stepNumber])) {
      setCompleted((prev) => ({ ...prev, [currentStep]: true }))
      setCurrentStep(stepNumber)
    }
  }

  return (
    <FormProvider {...methods}>
      <StepPrompt hasUnsavedChanges={methods.formState.isDirty} />
      <StepHeader
        completedSteps={completed}
        currentStep={currentStep}
        onStepNavigation={onStepNavigation}
      />
      <Container maxWidth="md" sx={{ minHeight: '50vh' }}>
        {txState !== TransactionStates.none && txState !== TransactionStates.success && (
          <TransactionLoading resetTxState={resetTxState} state={txState} />
        )}
        {txState === TransactionStates.success && <BadgeModelCreated />}
        {txState === TransactionStates.none && (
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack gap={3}>
              {currentStep === 0 && <HowItWorks />}
              {currentStep === 1 && <BadgeModelUIBasics />}
              {currentStep === 2 && <BadgeModelStrategy />}
              {currentStep === 3 && <BadgeModelEvidenceFormCreation />}
              {currentStep === 4 && <BadgeModelConfirmation />}

              <StepFooter
                color="purple"
                currentStep={currentStep}
                onBackCallback={onBackCallback}
                onNextCallback={onNextCallback}
              />
            </Stack>
          </form>
        )}
      </Container>
    </FormProvider>
  )
}
