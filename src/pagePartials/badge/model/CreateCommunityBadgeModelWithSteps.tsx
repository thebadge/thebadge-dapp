import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@mui/material'
import { FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import StepHeaderCommunity from './steps/community/StepHeaderCommunity'
import { defaultValues, getFieldsToValidateOnStep } from './utils'
import StepPrompt from '@/src/components/form/formWithSteps/StepPrompt'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import { notify } from '@/src/components/toast/Toast'
import { useIsRegistered } from '@/src/hooks/subgraph/useIsRegistered'
import { TransactionStates } from '@/src/hooks/useTransaction'
import { useTriggerRHF } from '@/src/hooks/useTriggerRHF'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import {
  CreateCommunityModelSchema,
  CreateCommunityModelSchemaType,
} from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import StepFooter from '@/src/pagePartials/badge/model/steps/StepFooter'
import StepInnerContainer from '@/src/pagePartials/badge/model/steps/StepInnerContainer'
import BadgeModelStrategy from '@/src/pagePartials/badge/model/steps/community/strategy/BadgeModelStrategy'
import BadgeModelEvidenceFormCreation from '@/src/pagePartials/badge/model/steps/evidence/BadgeModelEvidenceFormCreation'
import BadgeModelConfirmation from '@/src/pagePartials/badge/model/steps/preview/BadgeModelConfirmation'
import BadgeModelCreated from '@/src/pagePartials/badge/model/steps/preview/BadgeModelCreated'
import RegisterStep from '@/src/pagePartials/badge/model/steps/register/RegisterStep'
import HowItWorks from '@/src/pagePartials/badge/model/steps/terms/HowItWorks'
import BadgeModelUIBasics from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'
import { isTestnet } from '@/src/utils/network'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { ToastStates } from '@/types/toast'

type CreateModelStepsProps = {
  onSubmit: SubmitHandler<CreateCommunityModelSchemaType>
  txState: TransactionStates
  resetTxState: VoidFunction
}

export default function CreateCommunityBadgeModelWithSteps({
  onSubmit,
  resetTxState,
  txState = TransactionStates.none,
}: CreateModelStepsProps) {
  const { data: isRegistered } = useIsRegistered()
  const [currentStep, setCurrentStep] = useState(0)

  // Naive completed step implementation
  const [completed, setCompleted] = useState<Record<string, boolean>>(
    isRegistered ? { 1: true } : {},
  )
  const [hiddenSteps] = useState<Record<string, boolean>>(isRegistered ? { 1: true } : {})

  const userMetadata = useUserMetadata()

  const methods = useForm<z.infer<typeof CreateCommunityModelSchema>>({
    resolver: zodResolver(CreateCommunityModelSchema),
    defaultValues: defaultValues(BadgeModelControllerType.Community, {
      ...userMetadata,
      terms: isRegistered,
    }),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const triggerValidation = useTriggerRHF(methods)
  async function isValidStep() {
    const steps = getFieldsToValidateOnStep(BadgeModelControllerType.Community)
    return await triggerValidation(steps[currentStep])
  }

  // Navigation helpers to go back on the steps
  async function onBackCallback() {
    setCurrentStep((prev) => {
      if (isRegistered && prev == 2) {
        return 0
      }
      return prev === 0 ? 0 : prev - 1
    })
  }

  // Navigation helpers to go to the next step
  async function onNextCallback() {
    const isValid = await isValidStep()
    if (isValid) {
      setCompleted((prev) => ({ ...prev, [currentStep]: true }))
      setCurrentStep((prev) => {
        if (isRegistered && prev == 0) {
          return 2
        }
        return prev === 5 ? 5 : prev + 1
      })
    }
  }

  // Navigation helpers to jump to a given number step
  async function onStepNavigation(stepNumber: number) {
    // Safeguard to prevent navigation on Transaction
    if (txState !== TransactionStates.none) return
    // Allow go back
    if (currentStep > stepNumber) {
      setCurrentStep(stepNumber)
      return
    }
    const isValid = await isValidStep()
    // Only allows one step further or to a completed steps
    if (isValid && (stepNumber <= currentStep + 1 || completed[stepNumber])) {
      setCompleted((prev) => ({ ...prev, [currentStep]: true }))
      setCurrentStep(stepNumber)
    }
  }

  function notifyFormError(e: FieldErrors<CreateCommunityModelSchemaType>) {
    if (isTestnet) console.warn(e)
    notify({
      message: 'You may have an error on the form, please take a closer look.',
      type: ToastStates.infoFailed,
    })
  }

  return (
    <FormProvider {...methods}>
      <StepPrompt hasUnsavedChanges={methods.formState.isDirty} />
      <StepHeaderCommunity
        completedSteps={completed}
        currentStep={currentStep}
        hiddenSteps={hiddenSteps}
        onStepNavigation={onStepNavigation}
      />
      <Container maxWidth="md" sx={{ minHeight: '50vh' }}>
        {txState !== TransactionStates.none && txState !== TransactionStates.success && (
          <TransactionLoading resetTxState={resetTxState} state={txState} />
        )}
        {txState === TransactionStates.success && <BadgeModelCreated />}
        {txState === TransactionStates.none && (
          <form onSubmit={methods.handleSubmit(onSubmit, notifyFormError)}>
            <StepInnerContainer gap={3}>
              {currentStep === 0 && <HowItWorks />}
              {currentStep === 1 && <RegisterStep />}
              {currentStep === 2 && <BadgeModelUIBasics />}
              {currentStep === 3 && <BadgeModelStrategy />}
              {currentStep === 4 && <BadgeModelEvidenceFormCreation />}
              {currentStep === 5 && <BadgeModelConfirmation />}
              <StepFooter
                color="purple"
                currentStep={currentStep}
                onBackCallback={onBackCallback}
                onNextCallback={onNextCallback}
              />
            </StepInnerContainer>
          </form>
        )}
      </Container>
    </FormProvider>
  )
}
