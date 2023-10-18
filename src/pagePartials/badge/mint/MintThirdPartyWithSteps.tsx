import React, { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Stack } from '@mui/material'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import StepFooter from './steps/StepFooter'
import { defaultValues } from './utils'
import StepPrompt from '@/src/components/form/formWithSteps/StepPrompt'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { TransactionStates } from '@/src/hooks/useTransaction'
import { useTriggerRHF } from '@/src/hooks/useTriggerRHF'
import {
  MintThirdPartySchema,
  MintThirdPartySchemaType,
} from '@/src/pagePartials/badge/mint/schema/MintThirdPartySchema'
import StepHeaderThirdParty from '@/src/pagePartials/badge/mint/steps/StepHeaderThirdParty'
import FormThirdParty from '@/src/pagePartials/badge/mint/steps/dynamicForm/FormThirdParty'
import MintSucceed from '@/src/pagePartials/badge/mint/steps/preview/MintSucceed'
import SubmitPreviewThirdParty from '@/src/pagePartials/badge/mint/steps/preview/SubmitPreviewThirdParty'
import HowItWorksThirdParty from '@/src/pagePartials/badge/mint/steps/terms/HowItWorksThirdParty'

type MintStepsProps = {
  onSubmit: SubmitHandler<MintThirdPartySchemaType>
  txState: TransactionStates
  resetTxState: VoidFunction
}

const STEP_0 = ['terms']
// Use undefined to trigger a full schema validation, that makes the .superRefine logic to be executed
const STEP_1 = undefined
const STEP_2 = ['previewImage']

const FIELDS_TO_VALIDATE_ON_STEP = [STEP_0, STEP_1, STEP_2]

export default function MintThirdPartyWithSteps({
  onSubmit,
  resetTxState,
  txState = TransactionStates.none,
}: MintStepsProps) {
  const badgePreviewRef = useRef<HTMLDivElement>()
  const [currentStep, setCurrentStep] = useState(0)
  const modelId = useModelIdParam()

  // Naive completed step implementation
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  const methods = useForm<z.infer<typeof MintThirdPartySchema>>({
    resolver: zodResolver(MintThirdPartySchema),
    defaultValues: defaultValues(modelId),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const triggerValidation = useTriggerRHF(methods)
  const watchedPreferMintMethod = methods.watch('preferMintMethod')

  useEffect(() => {
    // Each time that the preferMintMethod changes, we wan to trigger the validation
    triggerValidation(STEP_1)
  }, [triggerValidation, watchedPreferMintMethod])

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
      <StepHeaderThirdParty
        completedSteps={completed}
        currentStep={currentStep}
        onStepNavigation={onStepNavigation}
      />
      <Container maxWidth="md" sx={{ minHeight: '50vh' }}>
        {txState !== TransactionStates.none && txState !== TransactionStates.success && (
          <TransactionLoading resetTxState={resetTxState} state={txState} />
        )}
        {txState === TransactionStates.success && <MintSucceed />}
        {txState === TransactionStates.none && (
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack gap={3}>
              {currentStep === 0 && <HowItWorksThirdParty />}
              {currentStep === 1 && <FormThirdParty />}
              {currentStep === 2 && <SubmitPreviewThirdParty badgePreviewRef={badgePreviewRef} />}

              <StepFooter
                color="blue"
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
