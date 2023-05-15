import { PropsWithChildren, createContext } from 'react'

import { useInterpret } from '@xstate/react'
import { InterpreterFrom } from 'xstate'

import { createModelMachine } from '../machine/createModelMachine'

export const CreateModelMachineContext = createContext({
  createService: {} as InterpreterFrom<typeof createModelMachine>,
})

export const CreateModelMachineProvider = (props: PropsWithChildren) => {
  const createService = useInterpret(createModelMachine, {
    actions: {
      applyAcceptedTermsOnContext: () => {
        // Action that store the accepted terms flag
      },
      applyBadgeUIBasicsOnContext: () => {
        // Action that store the badge ui config
      },
      applyBadgeStrategyOnContext: () => {
        // Action that store the strategy defined
      },
    },
    services: {
      validateTermsAndConditions: (context, event) => async () => {
        // Promise that validates if the Terms are accepted or not
        if (context) return Promise.resolve() // onDone
        return Promise.reject() // onError
      },
      validateBadgeUIBasics: (context, event) => async () => {
        // Promise that validates if the UI Basics are completed
      },
      validateBadgeStrategy: (context, event) => async () => {
        // Promise that validates if the Badge Strategy is completed
      },
      sendCreateTransaction: (context, event) => async () => {
        // Promise that send the transaction
      },
    },
  })

  return (
    <CreateModelMachineContext.Provider value={{ createService }}>
      {props.children}
    </CreateModelMachineContext.Provider>
  )
}
