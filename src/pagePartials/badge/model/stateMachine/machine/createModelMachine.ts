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
  id: 'BadgeModelCreation',
  initial: 'TermsAndConditions',
  states: {
    TermsAndConditions: {
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
        target: 'BadgeUiBasics',
      },
    },
    BadgeUiBasics: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            CONFIRM_BASIC_CONFIGS: {
              target: 'submitting',
              actions: 'applyBadgeUIBasicsOnContext',
            },
            BACK: {
              target: '#BadgeModelCreation.TermsAndConditions.idle',
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
        target: 'BadgeStrategy',
      },
    },
    BadgeStrategy: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            BACK: {
              target: '#BadgeModelCreation.BadgeUiBasics.idle',
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
        target: 'BadgePreview',
      },
    },
    BadgePreview: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            SEND_TX: {
              target: 'sendingTx',
            },
            BACK: {
              target: '#BadgeModelCreation.BadgeStrategy.idle',
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
