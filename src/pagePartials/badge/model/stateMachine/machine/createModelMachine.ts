import { createMachine, raise } from 'xstate'

import { BadgeStrategy, BadgeUIBasicsConfig, CreateEvent } from './types'

export interface MultiStepFormMachineContext {
  errorMessage?: string
  termsAndConditions?: boolean
  badgeUIBasics: BadgeUIBasicsConfig
  badgeStrategy: BadgeStrategy
}

export type MultiStepFormMachineEvent =
  | { type: CreateEvent.CONFIRM_TERMS }
  | { type: CreateEvent.CONFIRM_BASIC_CONFIGS }
  | { type: CreateEvent.CONFIRM_STRATEGY_FIELDS }
  | { type: CreateEvent.BACK }
  | { type: CreateEvent.SEND_TX }

export const createModelMachine = createMachine<
  MultiStepFormMachineContext,
  MultiStepFormMachineEvent
>({
  id: 'Badge Model Creation',
  initial: 'Accept Terms And Conditions',
  states: {
    'Accept Terms And Conditions': {
      initial: 'idle',
      states: {
        idle: {
          on: {
            CONFIRM_TERMS: {
              target: 'submitting',
              actions: 'applyAcceptedTermsOnContext',
            },
          },
        },
        submitting: {
          invoke: {
            src: 'validateTermsAndConditions',
            onDone: [
              {
                target: 'complete',
              },
            ],
            onError: [
              {
                target: 'idle',
              },
            ],
          },
        },
        complete: {
          type: 'final',
        },
      },
      onDone: {
        target: 'Badge UI Basics',
      },
    },
    'Badge UI Basics': {
      initial: 'idle',
      states: {
        idle: {
          on: {
            CONFIRM_BASIC_CONFIGS: {
              target: 'submitting',
              actions: 'applyBadgeUIBasicsOnContext',
            },
            BACK: {
              target: '#Badge Model Creation.Accept Terms And Conditions.idle',
              actions: raise(CreateEvent.CONFIRM_TERMS),
            },
          },
        },
        submitting: {
          invoke: {
            src: 'validateBadgeUIBasics',
            onError: [
              {
                target: 'idle',
              },
            ],
            onDone: [
              {
                target: 'complete',
              },
            ],
          },
        },
        complete: {
          type: 'final',
        },
      },
      onDone: {
        target: 'Badge Strategy',
      },
    },
    'Badge Strategy': {
      initial: 'idle',
      states: {
        idle: {
          on: {
            BACK: {
              target: '#Badge Model Creation.Badge UI Basics.idle',
              actions: raise(CreateEvent.CONFIRM_BASIC_CONFIGS),
            },
            CONFIRM_STRATEGY_FIELDS: {
              target: 'submitting',
              actions: 'applyBadgeStrategyOnContext',
            },
          },
        },
        submitting: {
          invoke: {
            src: 'validateBadgeStrategy',
            onDone: [
              {
                target: 'complete',
              },
            ],
            onError: [
              {
                target: 'idle',
              },
            ],
          },
        },
        complete: {
          type: 'final',
        },
      },
      onDone: {
        target: 'Badge Preview',
      },
    },
    'Badge Preview': {
      initial: 'idle',
      states: {
        idle: {
          on: {
            SEND_TX: {
              target: 'sendingTx',
            },
            BACK: {
              target: '#Badge Model Creation.Badge Strategy.idle',
              actions: raise(CreateEvent.CONFIRM_STRATEGY_FIELDS),
            },
          },
        },
        sendingTx: {
          invoke: {
            src: 'sendCreateTransaction',
            onDone: [
              {
                target: 'complete',
              },
            ],
            onError: [
              {
                target: 'idle',
              },
            ],
          },
        },
        complete: {
          type: 'final',
        },
      },
      onDone: {
        target: 'complete',
      },
    },
    complete: {
      type: 'final',
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
})
