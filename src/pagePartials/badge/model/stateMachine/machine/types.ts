import { z } from 'zod'

import { KlerosFormFieldSchema } from '@/src/components/form/helpers/customSchemas'

export type BadgeUIBasicsConfig = {
  background: string
}
export type BadgeStrategy = {
  fields: z.infer<typeof KlerosFormFieldSchema>
}

export enum CreateEvent {
  CONFIRM_TERMS = 'CONFIRM_TERMS',
  CONFIRM_BASIC_CONFIGS = 'CONFIRM_BASIC_CONFIGS',
  BACK = 'BACK',
  CONFIRM_STRATEGY_FIELDS = 'CONFIRM_STRATEGY_FIELDS',
  SEND_TX = 'SEND_TX',
}
