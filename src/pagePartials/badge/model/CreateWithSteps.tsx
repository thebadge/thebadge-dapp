import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@mui/material'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { State } from 'xstate'
import { z } from 'zod'

import { MultiStepFormMachineContext } from './stateMachine/machine/createModelMachine'
import StepHeader from './steps/StepHeader'
import StepPrompt from './steps/StepPrompt'
import { FIELDS_TO_VALIDATE_ON_STEP, defaultValues } from './utils'
import { useTriggerRHF } from '@/src/hooks/useTriggerRHF'
import {
  CreateModelSchema,
  CreateModelSchemaType,
} from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import StepFooter from '@/src/pagePartials/badge/model/steps/StepFooter'
import BadgeModelEvidenceFormCreation from '@/src/pagePartials/badge/model/steps/evidence/BadgeModelEvidenceFormCreation'
import BadgeModelConfirmation from '@/src/pagePartials/badge/model/steps/preview/BadgeModelConfirmation'
import BadgeModelStrategy from '@/src/pagePartials/badge/model/steps/strategy/BadgeModelStrategy'
import HowItWorks from '@/src/pagePartials/badge/model/steps/terms/HowItWorks'
import BadgeModelUIBasics from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'

const termsSelector = (state: State<MultiStepFormMachineContext>) => {
  return state.matches('TermsAndConditions')
}

export default function CreateWithSteps() {
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
  // const services = useContext(CreateModelMachineContext)
  // const isOnTerms = useSelector(services.createService, termsSelector)

  const onSubmit: SubmitHandler<CreateModelSchemaType> = (data) => console.log(data)

  // Navigation helpers to go back on the steps
  async function onBackCallback() {
    const isValid = await triggerValidation(FIELDS_TO_VALIDATE_ON_STEP[currentStep])
    if (isValid) setCurrentStep((prev) => (prev === 0 ? 0 : prev - 1))
  }

  // Navigation helpers to go to the next step
  async function onNextCallback() {
    const isValid = await triggerValidation(FIELDS_TO_VALIDATE_ON_STEP[currentStep])
    if (isValid) {
      setCompleted((prev) => ({ ...prev, [currentStep]: true }))
      setCurrentStep((prev) => (prev === 4 ? 4 : prev + 1))
    }
  }

  // Navigation helpers to jump to a given number step
  async function onStepNavigation(stepNumber: number) {
    const isValid = await triggerValidation(FIELDS_TO_VALIDATE_ON_STEP[currentStep])
    // Only allows one step further
    if (isValid && stepNumber <= currentStep + 1) {
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
      <Container maxWidth="md">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {currentStep === 0 && <HowItWorks />}
          {currentStep === 1 && <BadgeModelUIBasics />}
          {currentStep === 2 && <BadgeModelStrategy />}
          {currentStep === 3 && <BadgeModelEvidenceFormCreation />}
          {currentStep === 4 && <BadgeModelConfirmation />}

          <StepFooter
            currentStep={currentStep}
            onBackCallback={onBackCallback}
            onNextCallback={onNextCallback}
          />
        </form>
      </Container>
    </FormProvider>
  )
}
