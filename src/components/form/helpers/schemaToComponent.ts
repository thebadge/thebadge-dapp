import { z } from 'zod'

import TextField from '../TextField'
import { CheckBox } from '@/src/components/form/CheckBox'
import {
  AddressSchema,
  CheckBoxSchema,
  NumberSchema,
} from '@/src/components/form/helpers/customSchemas'

// Create the mapping btw each schema type to the React component used for it
export const mappingSchemaToComponents = [
  [z.string(), TextField],
  [CheckBoxSchema, CheckBox],
  [NumberSchema, TextField],
  [AddressSchema, TextField],
  // TODO Add file types
] as const // 👈 `as const` is necessary
