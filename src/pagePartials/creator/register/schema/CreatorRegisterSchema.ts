import { z } from 'zod'

import {
  AgreementSchema,
  AvatarSchema,
  EmailSchema,
  LongTextSchema,
  SimpleTwitterSchema,
} from '@/src/components/form/helpers/customSchemas'

const MIN_DISPLAY_NAME_CHARACTERS = 2
const MAX_DISPLAY_NAME_CHARACTERS = 30

export const CONTACT_METHODS_ENUM:
  | 'email'
  | 'website'
  | 'twitter'
  | 'discord'
  | 'linkedin'
  | 'github'
  | 'telegram' = 'email'

export const CONTACT_METHODS = [
  'email',
  'website',
  'twitter',
  'discord',
  'linkedin',
  'github',
  'telegram',
] as const

const RegisterSchema = z.object({
  // General Info
  name: z
    .string()
    .min(
      MIN_DISPLAY_NAME_CHARACTERS,
      `The display name should be at least  ${MIN_DISPLAY_NAME_CHARACTERS} characters.`,
    )
    .max(
      MAX_DISPLAY_NAME_CHARACTERS,
      `The display name should be short than ${MAX_DISPLAY_NAME_CHARACTERS} characters.`,
    )
    .nonempty(),
  description: LongTextSchema,
  logo: AvatarSchema, // Image Schema MUST BE the created one

  // Contact method
  email: EmailSchema,
  website: z.string().optional().nullable(),
  twitter: SimpleTwitterSchema.optional().nullable(),
  discord: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),

  preferContactMethod: z.enum(CONTACT_METHODS),
  terms: AgreementSchema,
})

export const CreatorRegisterSchema = z.object({
  register: RegisterSchema,
})

export const EditProfileSchema = z.object({
  // General Info
  name: z
    .string()
    .min(
      MIN_DISPLAY_NAME_CHARACTERS,
      `The display name should be at least  ${MIN_DISPLAY_NAME_CHARACTERS} characters.`,
    )
    .max(
      MAX_DISPLAY_NAME_CHARACTERS,
      `The display name should be short than ${MAX_DISPLAY_NAME_CHARACTERS} characters.`,
    ),
  description: LongTextSchema,
  logo: AvatarSchema.optional(), // Image Schema MUST BE the created one

  // Contact method
  email: EmailSchema,
  website: z.string().optional().nullable(),
  twitter: SimpleTwitterSchema.optional().nullable(),
  discord: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),

  preferContactMethod: z.enum(CONTACT_METHODS),
})

export type CreatorRegisterSchemaType = z.infer<typeof CreatorRegisterSchema>
export type EditProfileSchemaType = z.infer<typeof EditProfileSchema>
