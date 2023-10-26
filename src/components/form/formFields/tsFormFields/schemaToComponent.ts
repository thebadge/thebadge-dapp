import { z } from 'zod'

import CheckBoxWithTSForm from './CheckBox'
import FileInputWithTSForm from './FileInput'
import ImageInputWithTSForm from './ImageInput'
import NumberFieldWithTSForm from './NumberField'
import { TextAreaWithTSForm } from './TextArea'
import { TextFieldWithTSForm } from './TextField'
import {
  AddressSchema,
  CheckBoxSchema,
  FileSchema,
  ImageSchema,
  LinkSchema,
  LongTextSchema,
  NumberSchema,
  OptionalFileSchema,
  TwitterSchema,
} from '@/src/components/form/helpers/customSchemas'

/**
 * Create the mapping btw each schema type to the React component used for it, this mapping is used
 * with @ts-react/form on CustomFormFromSchema.
 * We MUST map just the KlerosSchema Types (KLEROS_LIST_TYPES) -> getZValidator
 */
export const mappingSchemaToComponents = [
  [z.string(), TextFieldWithTSForm],
  [LinkSchema, TextFieldWithTSForm],
  [CheckBoxSchema, CheckBoxWithTSForm],
  [NumberSchema, NumberFieldWithTSForm],
  [AddressSchema, TextFieldWithTSForm],
  [TwitterSchema, TextFieldWithTSForm],
  [LongTextSchema, TextAreaWithTSForm],
  [ImageSchema, ImageInputWithTSForm],
  [FileSchema, FileInputWithTSForm],
  [OptionalFileSchema, FileInputWithTSForm],
  // TODO Add file types
] as const // 👈 `as const` is necessary
