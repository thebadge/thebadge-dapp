import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@mui/material'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { State } from 'xstate'
import { z } from 'zod'

import { MultiStepFormMachineContext } from './stateMachine/machine/createModelMachine'
import StepHeader from './steps/StepHeader'
import StepPrompt from './steps/StepPrompt'
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

export const FORM_STORE_KEY = 'badge-model-creation'
/**
 * Retrieve stored values, in case that the user refresh the page or something
 * happens
 */
const defaultValues = () => {
  const storedValues = localStorage.getItem(FORM_STORE_KEY)
  if (storedValues) {
    return JSON.parse(storedValues)
  } else {
    return {
      textContrast: 'Black',
      backgroundImage: 'White Waves',
      template: 'Classic',
    }
  }
}
const STEP_0 = ['howItWorks']
const STEP_1 = [
  'name',
  'description',
  'badgeModelLogoUri',
  'textContrast',
  'backgroundImage',
  'template',
]
const STEP_2 = [
  'criteriaFileUri',
  'criteriaDeltaText',
  'challengePeriodDuration',
  'rigorousness',
  'mintCost',
  'validFor',
]
const STEP_3 = ['badgeMetadataColumns']
const FIELDS_TO_VALIDATE_ON_STEP = [STEP_0, STEP_1, STEP_2, STEP_3]
export default function CreateWithSteps() {
  const [currentStep, setCurrentStep] = useState(0)

  const methods = useForm<z.infer<typeof CreateModelSchema>>({
    resolver: zodResolver(CreateModelSchema),
    defaultValues: defaultValues(),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const triggerValidation = useTriggerRHF(methods)
  // const services = useContext(CreateModelMachineContext)
  // const isOnTerms = useSelector(services.createService, termsSelector)

  function onBackCallback() {
    //setCurrentStep((prev) => (prev === 0 ? 0 : prev - 1))
  }
  const onSubmit: SubmitHandler<CreateModelSchemaType> = (data) => console.log(data)
  async function onSubmitCallback() {
    const isValid = await triggerValidation(FIELDS_TO_VALIDATE_ON_STEP[currentStep])
    if (isValid) setCurrentStep((prev) => (prev === 4 ? 4 : prev + 1))
  }

  return (
    <FormProvider {...methods}>
      <StepPrompt hasUnsavedChanges={methods.formState.isDirty} />
      <StepHeader currentStep={currentStep} />
      <Container maxWidth="md">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {currentStep === 0 && <HowItWorks />}
          {currentStep === 1 && <BadgeModelUIBasics />}
          {currentStep === 2 && <BadgeModelStrategy />}
          {currentStep === 3 && <BadgeModelEvidenceFormCreation />}
          {currentStep === 4 && <BadgeModelConfirmation />}

          <StepFooter onBackCallback={onBackCallback} onSubmitCallback={onSubmitCallback} />
        </form>
      </Container>
    </FormProvider>
  )
}
