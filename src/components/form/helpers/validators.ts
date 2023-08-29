import { FieldError } from 'react-hook-form'
import { ZodType, z } from 'zod'

import {
  AddressSchema,
  CheckBoxSchema,
  FileSchema,
  ImageSchema,
  LinkSchema,
  LongTextSchema,
  NumberSchema,
  TwitterSchema,
} from '@/src/components/form/helpers/customSchemas'
import { KLEROS_LIST_TYPES, MetadataColumn } from '@/types/kleros/types'

const zText = z
  .string({
    required_error: 'Is required',
    invalid_type_error: 'Must be an string',
  })
  .min(2, { message: 'Text field most have at least 2 characters.' })

export function isEmail(email: string) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
}

function getZValidator(fieldType: KLEROS_LIST_TYPES) {
  switch (fieldType) {
    case KLEROS_LIST_TYPES.ADDRESS:
      return AddressSchema
    case KLEROS_LIST_TYPES.BOOLEAN:
      return CheckBoxSchema
    case KLEROS_LIST_TYPES.TWITTER_USER_ID:
      return TwitterSchema
    case KLEROS_LIST_TYPES.LINK:
      return LinkSchema
    case KLEROS_LIST_TYPES.LONG_TEXT:
      return LongTextSchema
    case KLEROS_LIST_TYPES.TEXT:
      return zText
    case KLEROS_LIST_TYPES.NUMBER:
      return NumberSchema
    case KLEROS_LIST_TYPES.IMAGE:
      return ImageSchema
    case KLEROS_LIST_TYPES.FILE:
      return FileSchema
    case KLEROS_LIST_TYPES.GTCR_ADDRESS:
    case KLEROS_LIST_TYPES.RICH_ADDRESS:
      return AddressSchema
  }
}

export function isMetadataColumnArray(obj: any): obj is MetadataColumn[] {
  if (obj !== null && typeof obj === 'object' && obj.length > 0) {
    return 'type' in obj[0]
  }
  return false
}

export default function klerosSchemaFactory(fields: MetadataColumn[]) {
  const shape: { [key: string]: ZodType } = {}
  fields.forEach((field, i) => {
    // If we change this "shape" key values, we need to update the createKlerosValuesObject on mintHelpers.ts
    shape[`${i}`] = getZValidator(field.type).describe(`${field.label} // ${field.description}`)
    //Magic explained here: https://github.com/iway1/react-ts-form#qol
  })
  return shape
  // return z.object(shape)
}

export function convertToFieldError(error: any): FieldError {
  return {
    message: error.errorMessage,
  } as FieldError
}
