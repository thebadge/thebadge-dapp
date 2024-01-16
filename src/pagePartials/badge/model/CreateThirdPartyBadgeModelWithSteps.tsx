import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@mui/material'
import { FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { defaultValues, getFieldsToValidateOnStep } from './utils'
import StepPrompt from '@/src/components/form/formWithSteps/StepPrompt'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import { notify } from '@/src/components/toast/Toast'
import { TransactionStates } from '@/src/hooks/useTransaction'
import { useTriggerRHF } from '@/src/hooks/useTriggerRHF'
import {
  CreateThirdPartyModelSchema,
  CreateThirdPartyModelSchemaType,
} from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import StepFooter from '@/src/pagePartials/badge/model/steps/StepFooter'
import StepInnerContainer from '@/src/pagePartials/badge/model/steps/StepInnerContainer'
import BadgeModelConfirmation from '@/src/pagePartials/badge/model/steps/preview/BadgeModelConfirmation'
import BadgeModelCreated from '@/src/pagePartials/badge/model/steps/preview/BadgeModelCreated'
import StepHeaderThirdParty from '@/src/pagePartials/badge/model/steps/thirdParty/StepHeaderThirdParty'
import BadgeModelStrategy from '@/src/pagePartials/badge/model/steps/thirdParty/strategy/BadgeModelStrategy'
import BadgeModelUIBasics from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'
import { isTestnet } from '@/src/utils/network'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { ToastStates } from '@/types/toast'

type CreateModelStepsProps = {
  onSubmit: SubmitHandler<CreateThirdPartyModelSchemaType>
  txState: TransactionStates
  resetTxState: VoidFunction
}

export default function CreateThirdPartyBadgeModelWithSteps({
  onSubmit,
  resetTxState,
  txState = TransactionStates.none,
}: CreateModelStepsProps) {
  const [currentStep, setCurrentStep] = useState(0)

  // Naive completed step implementation
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  const methods = useForm<z.infer<typeof CreateThirdPartyModelSchema>>({
    resolver: zodResolver(CreateThirdPartyModelSchema),
    defaultValues: defaultValues(BadgeModelControllerType.ThirdParty),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  // Watched template to trigger different validations
  const watchedTemplate = methods.watch('template')

  const triggerValidation = useTriggerRHF(methods)
  async function isValidStep() {
    const steps = getFieldsToValidateOnStep(BadgeModelControllerType.ThirdParty, watchedTemplate)
    console.log('steps', { steps, watchedTemplate })
    console.log('trigger', await methods.trigger(steps[0]))
    console.log('values', methods.getValues(steps[0]))

    return await triggerValidation(steps[currentStep])
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
      setCurrentStep((prev) => (prev === 2 ? 2 : prev + 1))
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

  function notifyFormError(e: FieldErrors<CreateThirdPartyModelSchemaType>) {
    if (isTestnet) console.warn(e)
    notify({
      message: 'You may have an error on the form, please take a closer look.',
      type: ToastStates.infoFailed,
    })
  }

  return (
    <FormProvider {...methods}>
      <StepPrompt hasUnsavedChanges={methods.formState.isDirty} />
      <StepHeaderThirdParty
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
          <form onSubmit={methods.handleSubmit(onSubmit, notifyFormError)}>
            <StepInnerContainer gap={3}>
              {currentStep === 0 && <BadgeModelUIBasics />}
              {currentStep === 1 && <BadgeModelStrategy />}
              {currentStep === 2 && <BadgeModelConfirmation />}

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
