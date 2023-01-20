import { ZodType, z } from 'zod'

import {
  AddressSchema,
  CheckBoxSchema,
  FileSchema,
  ImageSchema,
  LongTextSchema,
  NumberSchema,
} from '@/src/components/form/helpers/customSchemas'
import { KLEROS_LIST_TYPES, MetadataColumn } from '@/src/utils/kleros/types'

const zAddress = AddressSchema
const zNumber = NumberSchema
const zBoolean = CheckBoxSchema
const zLongText = LongTextSchema
const zImage = ImageSchema
const zFile = FileSchema

const zText = z
  .string({
    required_error: 'Is required',
    invalid_type_error: 'Must be an string',
  })
  .min(2, { message: 'Text field most have at least 2 characters.' })

const zLink = z
  .string({
    required_error: 'Is required',
    invalid_type_error: 'Must be a link',
  })
  .startsWith('http')

const zTwitterUser = z
  .string({
    required_error: 'Is required',
    invalid_type_error: 'Must be a twitter user',
  })
  .startsWith('@')

function getZValidator(fieldType: KLEROS_LIST_TYPES) {
  switch (fieldType) {
    case KLEROS_LIST_TYPES.ADDRESS:
      return zAddress
    case KLEROS_LIST_TYPES.BOOLEAN:
      return zBoolean
    case KLEROS_LIST_TYPES.TWITTER_USER_ID:
      return zTwitterUser
    case KLEROS_LIST_TYPES.LINK:
      return zLink
    case KLEROS_LIST_TYPES.LONG_TEXT:
      return zLongText
    case KLEROS_LIST_TYPES.TEXT:
      return zText
    case KLEROS_LIST_TYPES.NUMBER:
      return zNumber
    case KLEROS_LIST_TYPES.IMAGE:
      return zImage
    case KLEROS_LIST_TYPES.FILE:
      return zFile
    case KLEROS_LIST_TYPES.GTCR_ADDRESS:
    case KLEROS_LIST_TYPES.RICH_ADDRESS:
      return zAddress
  }
}

export default function schemaFactory(fields: MetadataColumn[]) {
  const shape: { [key: string]: ZodType } = {}
  fields.forEach((field) => {
    shape[field.label] = getZValidator(field.type).describe(
      `${field.label} // ${field.description}`,
    )
    //Magic explained here: https://github.com/iway1/react-ts-form#qol
  })

  return z.object(shape)
}
