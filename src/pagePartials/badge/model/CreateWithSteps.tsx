import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { State } from 'xstate'
import { z } from 'zod'

import { MultiStepFormMachineContext } from './stateMachine/machine/createModelMachine'
import StepHeader from './steps/StepHeader'
import { CreateModelSchema } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import StepFooter from '@/src/pagePartials/badge/model/steps/StepFooter'
import EvidenceFormCreation from '@/src/pagePartials/badge/model/steps/evidence/EvidenceFormCreation'
import BadgeModelStrategy from '@/src/pagePartials/badge/model/steps/strategy/BadgeModelStrategy'
import BadgeModelUIBasics from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'

const steps = ['Help', 'Badge type basics', 'Evidence form', 'Badge Type Preview']

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
  const methods = useForm<z.infer<typeof CreateModelSchema>>({
    resolver: zodResolver(CreateModelSchema),
    defaultValues: defaultValues(),
  })
  // const services = useContext(CreateModelMachineContext)
  // const isOnTerms = useSelector(services.createService, termsSelector)

  return (
    <FormProvider {...methods}>
      <StepHeader />
      <Container maxWidth="md">
        <p>Step 1</p>
        <BadgeModelUIBasics />
        <p>Step 2</p>
        <BadgeModelStrategy />
        <p>Step 3</p>
        <EvidenceFormCreation />
        <StepFooter />
      </Container>
    </FormProvider>
  )
}
