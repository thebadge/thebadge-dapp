import { isAddress } from 'ethers/lib/utils'
import { ZodType, z } from 'zod'

import { KLEROS_LIST_TYPES, MetadataColumn } from '@/src/utils/kleros/types'

const zAddress = z
  .string({ required_error: 'Is required' })
  .refine(isAddress, { message: 'Address must be an valid Ethereum addresses.' })

const zNumber = z.number({
  required_error: 'Is required',
  invalid_type_error: 'Must be a number',
})

const zText = z
  .string({
    required_error: 'Is required',
    invalid_type_error: 'Must be an string',
  })
  .min(2, { message: 'Text field most have at least 2 characters.' })

const zLongText = z
  .string({
    required_error: 'Is required',
    invalid_type_error: 'Must be an string',
  })
  .min(25, { message: 'Text field most have at least 25 characters.' })

const zBoolean = z.boolean({
  required_error: 'Is required',
  invalid_type_error: 'Must be a boolean',
})

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

// TODO Move to env variables
const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const zImage = z
  .custom<File>()
  .refine((files) => files?.length == 1, 'Image is required.')
  .refine((files) => files?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
    '.jpg, .jpeg, .png and .webp files are accepted.',
  )

const zFile = z
  .custom<File>()
  .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)

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
    shape[field.label] = getZValidator(field.type)
  })

  return z.object(shape)
}
