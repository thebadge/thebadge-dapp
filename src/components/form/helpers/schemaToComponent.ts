import { z } from 'zod'

import TextField from '../TextField'
import AgreementField from '@/src/components/form/AgreementField'
import AvatarInput from '@/src/components/form/AvatarInput'
import CheckBox from '@/src/components/form/CheckBox'
import DescriptionInputField from '@/src/components/form/DescriptionInputField'
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
  AgreementSchema,
  AvatarSchema,
  ChallengePeriodTypeSchema,
  CheckBoxSchema,
  DescriptionTextSchema,
  EmailSchema,
  ExpirationTypeSchema,
  FileSchema,
  ImageSchema,
  KlerosDynamicFields,
  KlerosFieldTypeSchema,
  LongTextSchema,
  NumberSchema,
  OptionalFileSchema,
  SeverityTypeSchema,
  TokenInputSchema,
  TwitterSchema,
} from '@/src/components/form/helpers/customSchemas'
import KlerosDynamicFieldsCreator from '@/src/components/form/klerosDynamicFormField/FormFieldCreator'

// Create the mapping btw each schema type to the React component used for it
export const mappingSchemaToComponents = [
  [z.string(), TextField],
  [CheckBoxSchema, CheckBox],
  [NumberSchema, NumberField],
  [AddressSchema, TextField],
  [TwitterSchema, TextField],
  [EmailSchema, TextField],
  [LongTextSchema, TextArea],
  [ImageSchema, ImageInput],
  [AvatarSchema, AvatarInput],
  [FileSchema, FileInput],
  [OptionalFileSchema, FileInput],
  [TokenInputSchema, TokenInput],
  [AgreementSchema, AgreementField],
  [KlerosFieldTypeSchema, DropdownSelect],
  [KlerosDynamicFields, KlerosDynamicFieldsCreator],
  [SeverityTypeSchema, SeveritySelector],
  [ExpirationTypeSchema, ExpirationField],
  [ChallengePeriodTypeSchema, NumberField],
  [DescriptionTextSchema, DescriptionInputField],
  // TODO Add file types
] as const // 👈 `as const` is necessary
