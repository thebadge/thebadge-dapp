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
import BadgeModelUIBasics from '@/src/pagePartials/badge/model/steps/uiBasics/BadgeModelUIBasics'

const steps = ['Help', 'Badge type basics', 'Evidence form', 'Badge Type Preview']

const termsSelector = (state: State<MultiStepFormMachineContext>) => {
  return state.matches('TermsAndConditions')
}

export default function CreateWithSteps() {
  const methods = useForm<z.infer<typeof CreateModelSchema>>({
    resolver: zodResolver(CreateModelSchema),
  })
  // const services = useContext(CreateModelMachineContext)
  // const isOnTerms = useSelector(services.createService, termsSelector)

  return (
    <FormProvider {...methods}>
      <StepHeader />
      <Container maxWidth="md">
        <BadgeModelUIBasics />
        <StepFooter />
      </Container>
    </FormProvider>
  )
}
