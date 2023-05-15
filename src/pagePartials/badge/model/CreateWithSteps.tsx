import { useContext } from 'react'

import { useSelector } from '@xstate/react'
import { State } from 'xstate'

import { CreateModelMachineContext } from '@/src/pagePartials/badge/model/stateMachine/context/createModelContext'
import { MultiStepFormMachineContext } from '@/src/pagePartials/badge/model/stateMachine/machine/createModelMachine'

const steps = ['Help', 'Badge type basics', 'Evidence form', 'Badge Type Preview']

const termsSelector = (state: State<MultiStepFormMachineContext>) => {
  return state.matches('Accept Terms And Conditions')
}
export default function CreateWithSteps() {
  const services = useContext(CreateModelMachineContext)
  const isOnTerms = useSelector(services.createService, termsSelector)

  return <></>
}
