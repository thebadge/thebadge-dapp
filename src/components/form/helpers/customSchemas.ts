import { createUniqueFieldSchema } from '@ts-react/form'
import { isAddress } from 'ethers/lib/utils'
import { z } from 'zod'

import { isEmail } from '@/src/components/form/helpers/validators'
import { KLEROS_LIST_TYPES_KEYS } from '@/types/kleros/types'

// Why we need these schemas?
// https://github.com/iway1/react-ts-form#dealing-with-collisions

export const CheckBoxSchema = createUniqueFieldSchema(
  z.boolean({
    required_error: 'Is required',
    invalid_type_error: 'Must be a boolean',
  }),
  'CheckBoxSchema',
)

export const LinkSchema = createUniqueFieldSchema(
  z
    .string({
      required_error: 'Is required',
      invalid_type_error: 'Must be a link',
    })
    .refine((value) => value.startsWith('http'), {
      message: 'You need to add valid url.',
    }),
  'LinkSchema',
)
export const AgreementSchema = z
  .boolean({
    required_error: 'You need to agree to be able to continue.',
    invalid_type_error: 'You must agree to continue.',
  })
  .refine((value) => value, {
    message: 'You need to agree to be able to continue.',
  })
export const AgreementSchemaBranded = createUniqueFieldSchema(AgreementSchema, 'AgreementSchema')

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

export const TwitterSchema = createUniqueFieldSchema(
  z
    .string({
      required_error: 'Is required',
      invalid_type_error: 'Must be a twitter user',
    })
    .startsWith('@'),
  'TwitterSchema',
)

export const EmailSchema = z.string({ required_error: 'Is required' }).refine(isEmail, {
  message: 'Must be a valid email addresses.',
})

export const TokenInputSchema = z.string({ required_error: 'Is required' })

export const NumberSchema = createUniqueFieldSchema(
  z.number({
    required_error: 'Is required',
    invalid_type_error: 'Must be a number',
  }),
  'NumberSchema',
)

export const LongTextSchema = createUniqueFieldSchema(
  z
    .string({
      required_error: 'Is required',
      invalid_type_error: 'Must be an string',
    })
    .min(25, { message: 'Text field most have at least 25 characters.' }),
  'LongTextSchema',
)
export const DescriptionTextSchema = createUniqueFieldSchema(
  z
    .string({
      required_error: 'Is required',
      invalid_type_error: 'Must be an string',
    })
    .min(25, { message: 'Text field most have at least 25 characters.' }),
  'DescriptionTextSchema',
)

// TODO Move to env variables
const ONE_MB = 1000000
const MAX_FILE_SIZE = ONE_MB * 5
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']

export const ImageSchema = createUniqueFieldSchema(
  z
    .any()
    .refine((value) => !!value?.base64File, 'Upload an image is required.')
    .refine(
      (value) => (value?.base64File?.length / 4) * 3 <= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    )
    .refine(
      (value) => ACCEPTED_IMAGE_TYPES.includes(value?.mimeType),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    ),
  'ImageSchema',
)

export const AvatarSchema = createUniqueFieldSchema(
  z
    .any()
    .refine((value) => !!value?.base64File, 'Upload an image is required.')
    .refine(
      (value) => (value?.base64File?.length / 4) * 3 <= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    )
    .refine(
      (value) => ACCEPTED_IMAGE_TYPES.includes(value?.mimeType),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    ),
  'AvatarSchema',
)

export const FileSchema = createUniqueFieldSchema(
  z
    .any()
    .refine((value) => !!value && !!value.base64File, 'Upload a file is required.')
    .refine(
      (value) => (value?.base64File?.length / 4) * 3 <= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    ),
  'FileSchema',
)

export const DeltaPDFSchema = z.object({ string: z.string(), delta: z.any() })

export const OptionalFileSchema = createUniqueFieldSchema(
  z
    .any()
    .refine((value) => !!value && !!value.base64File, 'Upload a file is required.')
    .refine(
      (value) => (value?.base64File?.length / 4) * 3 <= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    )
    .optional()
    .nullable(),
  'OptionalFileSchema',
)

export const ExpirationTypeSchema = z.number({
  required_error: 'Is required',
  invalid_type_error: 'Must enter an amount of days',
})

export const ChallengePeriodTypeSchema = createUniqueFieldSchema(
  z
    .number({
      required_error: 'Is required',
      invalid_type_error: 'Must enter an amount of days',
    })
    .min(2, 'The challenge time must be greater than 1 day')
    .max(90, `The challenge period duration can't be greater than 90 days.`),
  'ChallengePeriodTypeSchema',
)

export const SeverityTypeSchema = createUniqueFieldSchema(
  z.object({
    amountOfJurors: z
      .number()
      .positive()
      .refine((v) => v % 2 != 0, 'Must be even'),
    challengeBounty: z.string(),
  }),
  'SeverityTypeSchema',
)

export const KlerosFieldTypeSchema = createUniqueFieldSchema(
  z.enum(KLEROS_LIST_TYPES_KEYS),
  'FieldTypeSchema',
)

// Schema used to generate a form inside the KlerosDynamicFields handler and also
// to create the KlerosDynamicFields Unique field
export const KlerosFormFieldSchema = z.object({
  label: z
    .string()
    .describe('Name // Field name that the user will be when they create the badge.'),
  type: KlerosFieldTypeSchema.describe('Field Type // Type of the required data.'),
  description: LongTextSchema.describe(
    'Description // Field description that explains what the field data is.',
  ),
})

export const KlerosDynamicFields = createUniqueFieldSchema(
  z
    .array(KlerosFormFieldSchema, {
      required_error: 'Must provide at least one field.',
    })
    .min(1, 'Must provide at least one field.')
    .max(20, `Can't add more than twenty (20)`),
  'KlerosDynamicFields',
)

export const ThirdPartyAdministratorsFields = createUniqueFieldSchema(
  z
    .array(AddressSchema, {
      required_error: 'Must provide at least one administrator.',
    })
    .min(1, 'Must provide at least one administrator.')
    .max(10, `Can't add more than ten (10)`),
  'ThirdPartyAdministratorsFields',
)
