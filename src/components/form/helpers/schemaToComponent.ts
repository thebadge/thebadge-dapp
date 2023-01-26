import { z } from 'zod'

import TextField from '../TextField'
import CheckBox from '@/src/components/form/CheckBox'
import DropdownSelect from '@/src/components/form/DropdownSelect'
import ImageInput from '@/src/components/form/ImageInput'
import NumberField from '@/src/components/form/NumberField'
import TextArea from '@/src/components/form/TextArea'
import TokenInput from '@/src/components/form/TokenInput'
import {
  AddressSchema,
  CheckBoxSchema,
  FileSchema,
  ImageSchema,
  KlerosDynamicFields,
  KlerosFieldTypeSchema,
  LongTextSchema,
  NumberSchema,
  TokenInputSchema,
} from '@/src/components/form/helpers/customSchemas'
import KlerosDynamicFieldsCreator from '@/src/components/form/klerosDynamicFormField/FormFieldCreator'

// Create the mapping btw each schema type to the React component used for it
export const mappingSchemaToComponents = [
  [z.string(), TextField],
  [z.number(), TextField],
  [CheckBoxSchema, CheckBox],
  [NumberSchema, NumberField],
  [AddressSchema, TextField],
  [LongTextSchema, TextArea],
  [ImageSchema, ImageInput],
  [FileSchema, ImageInput],
  [TokenInputSchema, TokenInput],
  [KlerosFieldTypeSchema, DropdownSelect],
  [KlerosDynamicFields, KlerosDynamicFieldsCreator],
  // TODO Add file types
] as const // 👈 `as const` is necessary
