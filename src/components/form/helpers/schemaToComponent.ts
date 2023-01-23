import { z } from 'zod'

import TextField from '../TextField'
import { CheckBox } from '@/src/components/form/CheckBox'
import { ImageInput } from '@/src/components/form/ImageInput'
import NumberField from '@/src/components/form/NumberField'
import TextArea from '@/src/components/form/TextArea'
import {
  AddressSchema,
  CheckBoxSchema,
  FileSchema,
  ImageSchema,
  LongTextSchema,
  NumberSchema,
} from '@/src/components/form/helpers/customSchemas'

// Create the mapping btw each schema type to the React component used for it
export const mappingSchemaToComponents = [
  [z.string(), TextField],
  [CheckBoxSchema, CheckBox],
  [NumberSchema, NumberField],
  [AddressSchema, TextField],
  [LongTextSchema, TextArea],
  [ImageSchema, ImageInput],
  [FileSchema, ImageInput],

  // TODO Add file types
] as const // 👈 `as const` is necessary
