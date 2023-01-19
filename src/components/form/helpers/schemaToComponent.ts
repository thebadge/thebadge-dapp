import { Checkbox, TextField } from '@mui/material'
import { createTsForm } from '@ts-react/form'
import { z } from 'zod'

// create the mapping
const mapping = [
  [z.string(), TextField],
  [z.boolean(), Checkbox],
  [z.number(), TextField],
  // TODO Add file types
] as const // 👈 `as const` is necessary

// A typesafe React component
const CustomFormFromSchema = createTsForm(mapping)
