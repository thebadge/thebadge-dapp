import { z } from 'zod'

import TextField from '../TextField'
import CheckBox from '@/src/components/form/CheckBox'
import DropdownSelect from '@/src/components/form/DropdownSelect'
import ImageInput from '@/src/components/form/ImageInput'
import NumberField from '@/src/components/form/NumberField'
import TextArea from '@/src/components/form/TextArea'
import {
  AddressSchema,
  CheckBoxSchema,
  FileSchema,
  ImageSchema,
  KlerosDynamicFields,
  KlerosFieldTypeSchema,
  LongTextSchema,
  NumberSchema,
} from '@/src/components/form/helpers/customSchemas'
import KlerosDynamicFieldsCreator from '@/src/components/form/klerosDynamicFormField/FormFieldCreator'

// Create the mapping btw each schema type to the React component used for it
export const mappingSchemaToComponents = [
  [z.string(), TextField],
  [CheckBoxSchema, CheckBox],
  [NumberSchema, NumberField],
  [AddressSchema, TextField],
  [LongTextSchema, TextArea],
  [ImageSchema, ImageInput],
  [FileSchema, ImageInput],
  [KlerosFieldTypeSchema, DropdownSelect],
  [KlerosDynamicFields, KlerosDynamicFieldsCreator],
  // TODO Add file types
] as const // 👈 `as const` is necessary
