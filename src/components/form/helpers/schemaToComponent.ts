import { TextField } from '@mui/material'
import { z } from 'zod'

import { CheckBox } from '@/src/components/form/CheckBox'
import { CheckBoxSchema } from '@/src/components/form/helpers/customSchemas'

// create the mapping
export const mappingSchemaToComponents = [
  [z.string(), TextField],
  [CheckBoxSchema, CheckBox],
  [z.number(), TextField],
  // TODO Add file types
] as const // 👈 `as const` is necessary
