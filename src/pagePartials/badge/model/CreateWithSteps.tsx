import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { State } from 'xstate'
import { z } from 'zod'

import { MultiStepFormMachineContext } from './stateMachine/machine/createModelMachine'
import StepHeader from './steps/StepHeader'
import { CreateModelSchema } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import StepFooter from '@/src/pagePartials/badge/model/steps/StepFooter'
import BadgeModelEvidenceFormCreation from '@/src/pagePartials/badge/model/steps/evidence/BadgeModelEvidenceFormCreation'
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
      backgroundImage: 'Two',
    }
  }
}

export default function CreateWithSteps() {
  const [currentStep, setCurrentStep] = useState(0)

  const methods = useForm<z.infer<typeof CreateModelSchema>>({
    resolver: zodResolver(CreateModelSchema),
    defaultValues: defaultValues(),
  })
  // const services = useContext(CreateModelMachineContext)
  // const isOnTerms = useSelector(services.createService, termsSelector)

  return (
    <FormProvider {...methods}>
      <StepHeader currentStep={currentStep} />
      <Container maxWidth="md">
        {currentStep === 0 && <HowItWorks />}
        {currentStep === 1 && <BadgeModelUIBasics />}
        {currentStep === 2 && <BadgeModelStrategy />}
        {currentStep === 3 && <BadgeModelEvidenceFormCreation />}
        <StepFooter
          onBackCallback={() => setCurrentStep((prev) => (prev === 0 ? 0 : prev - 1))}
          onSubmitCallback={() => setCurrentStep((prev) => (prev === 3 ? 3 : prev + 1))}
        />
      </Container>
    </FormProvider>
  )
}
