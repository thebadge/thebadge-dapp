import React, { useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Stack } from '@mui/material'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import StepFooter from './steps/StepFooter'
import StepHeader from './steps/StepHeader'
import { FIELDS_TO_VALIDATE_ON_STEP, defaultValues } from './utils'
import StepPrompt from '@/src/components/form/formWithSteps/StepPrompt'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import { TransactionStates } from '@/src/hooks/useTransaction'
import { useTriggerRHF } from '@/src/hooks/useTriggerRHF'
import {
  MintBadgeSchema,
  MintBadgeSchemaType,
} from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import DynamicForm from '@/src/pagePartials/badge/mint/steps/dynamicForm/community/DynamicEvidenceForm'
import MintSucceed from '@/src/pagePartials/badge/mint/steps/preview/MintSucceed'
import SubmitPreview from '@/src/pagePartials/badge/mint/steps/preview/SubmitPreview'
import HowItWorks from '@/src/pagePartials/badge/mint/steps/terms/HowItWorks'

type MintStepsProps = {
  onSubmit: SubmitHandler<MintBadgeSchemaType>
  txState: TransactionStates
  resetTxState: VoidFunction
}

export default function MintCommunityWithSteps({
  onSubmit,
  resetTxState,
  txState = TransactionStates.none,
}: MintStepsProps) {
  const badgePreviewRef = useRef<HTMLDivElement>()
  const [currentStep, setCurrentStep] = useState(0)
  const { badgeModelId } = useModelIdParam()

  // Naive completed step implementation
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  const methods = useForm<z.infer<typeof MintBadgeSchema>>({
    resolver: zodResolver(MintBadgeSchema),
    defaultValues: defaultValues(badgeModelId),
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
    // Allow go back
    if (currentStep > stepNumber) {
      setCurrentStep(stepNumber)
      return
    }
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
        {txState === TransactionStates.success && <MintSucceed />}
        {txState === TransactionStates.none && (
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack gap={3}>
              {currentStep === 0 && <HowItWorks />}
              {currentStep === 1 && (
                <DynamicForm onBackCallback={onBackCallback} onNextCallback={onNextCallback} />
              )}
              {currentStep === 2 && <SubmitPreview badgePreviewRef={badgePreviewRef} />}

              {/* We disable the footer on the dynamic form, bc its need to handle his own footer */}
              {currentStep !== 1 && (
                <StepFooter
                  color="blue"
                  currentStep={currentStep}
                  onBackCallback={onBackCallback}
                  onNextCallback={onNextCallback}
                />
              )}
            </Stack>
          </form>
        )}
      </Container>
    </FormProvider>
  )
}
