import { z } from 'zod'

import {
  AddressSchema,
  ExpirationTypeSchema,
  ImageSchema,
  LongTextSchema,
  TokenInputSchema,
} from '@/src/components/form/helpers/customSchemas'

export const BodyDataConfigurationSchema = z.object({
  // ------ BASICS FIELD ------
  courseName: z.string(),
  achievementDescription: z.string(),
  achievementDate: z.string(),
})
export type BodyDataConfigurationSchemaType = z.infer<typeof BodyDataConfigurationSchema>

export const SignatureConfigurationSchema = z.object({
  // ------ BASICS FIELD ------
  signatureEnabled: z.boolean(),
  signerTitle: z.string(),
  signerSubline: z.string(),
  signatureImage: ImageSchema,
})
export type SignatureConfigurationSchemaType = z.infer<typeof SignatureConfigurationSchema>

export const FooterConfigurationSchema = z.object({
  // ------ BASICS FIELD ------
  footerEnabled: z.boolean(),
  footerText: z.string(),
})
export type FooterConfigurationSchemaType = z.infer<typeof FooterConfigurationSchema>

export const IssuerConfigurationSchema = z.object({
  // ------ BASICS FIELD ------
  customIssuerEnabled: z.boolean(),
  issuedByLabel: z.string(),
  issuerAvatarUrl: z.string(),
})
export type IssuerConfigurationSchemaType = z.infer<typeof IssuerConfigurationSchema>

export const CreateThirdPartyModelSchema = z
  .object({
    // ------ UI BASICS FIELD ------
    name: z.string().max(28),
    description: LongTextSchema,
    badgeModelLogoUri: ImageSchema,
    textContrast: z.string(),
    backgroundImage: z.string(),
    template: z.string(),
    // ------ STRATEGY FIELD ------
    mintFee: TokenInputSchema,
    validFor: ExpirationTypeSchema,
    // administrators: ThirdPartyAdministratorsFields, // TODO ENABLE ONCE WE HAVE THE SUPPORT ON THE UI
    administrators: AddressSchema, // TODO REMOVE ONCE WE HAVE THE SUPPORT ON THE UI
  })
  .merge(BodyDataConfigurationSchema)
  .merge(SignatureConfigurationSchema)
  .merge(FooterConfigurationSchema)
  .merge(IssuerConfigurationSchema)

export type CreateThirdPartyModelSchemaType = z.infer<typeof CreateThirdPartyModelSchema>
