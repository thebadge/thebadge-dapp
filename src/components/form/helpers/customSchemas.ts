import { createUniqueFieldSchema } from '@ts-react/form'
import { isAddress } from 'ethers/lib/utils'
import { z } from 'zod'

// Why we need these schemas?
// https://github.com/iway1/react-ts-form#dealing-with-collisions

export const CheckBoxSchema = createUniqueFieldSchema(
  z.boolean({
    required_error: 'Is required',
    invalid_type_error: 'Must be a boolean',
  }),
  'CheckBoxSchema',
)

export const RadioButtonSchema = createUniqueFieldSchema(
  z.boolean({
    required_error: 'Is required',
    invalid_type_error: 'Must be a boolean',
  }),
  'RadioButtonSchema',
)

export const AddressSchema = createUniqueFieldSchema(
  z.string({ required_error: 'Is required' }).refine(isAddress, {
    message: 'Address must be an valid Ethereum addresses.',
  }),
  'AddressSchema',
)

export const NumberSchema = createUniqueFieldSchema(
  z.number({
    required_error: 'Is required',
    invalid_type_error: 'Must be a number',
  }),
  'NumberSchema',
)
