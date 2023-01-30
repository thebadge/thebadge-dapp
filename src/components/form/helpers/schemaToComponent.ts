import { z } from 'zod'

import TextField from '../TextField'
import CheckBox from '@/src/components/form/CheckBox'
import DropdownSelect from '@/src/components/form/DropdownSelect'
import ExpirationField from '@/src/components/form/ExpirationField'
import FileInput from '@/src/components/form/FileInput'
import ImageInput from '@/src/components/form/ImageInput'
import NumberField from '@/src/components/form/NumberField'
import SeveritySelector from '@/src/components/form/SeveritySelector'
import TextArea from '@/src/components/form/TextArea'
import TokenInput from '@/src/components/form/TokenInput'
import {
  AddressSchema,
  CheckBoxSchema,
  ExpirationTypeSchema,
  FileSchema,
  ImageSchema,
  KlerosDynamicFields,
  KlerosFieldTypeSchema,
  LongTextSchema,
  NumberSchema,
  SeverityTypeSchema,
  TokenInputSchema,
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
  [FileSchema, FileInput],
  [TokenInputSchema, TokenInput],
  [KlerosFieldTypeSchema, DropdownSelect],
  [KlerosDynamicFields, KlerosDynamicFieldsCreator],
  [SeverityTypeSchema, SeveritySelector],
  [ExpirationTypeSchema, ExpirationField],
  // TODO Add file types
] as const // 👈 `as const` is necessary
