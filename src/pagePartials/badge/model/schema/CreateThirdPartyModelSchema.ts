import { z } from 'zod'
import { RefinementCtx } from 'zod/lib/types'

import {
  AddressSchema,
  AvatarSchema,
  ExpirationTypeSchema,
  ImageSchema,
  LongTextSchema,
  TokenInputSchema,
} from '@/src/components/form/helpers/customSchemas'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

export const BodyDataConfigurationSchema = z.object({
  // ------ DIPLOMA BASICS FIELD ------
  courseName: z.string(),
  achievementDescription: z.string().default('has successfully completed the course'),
  achievementDate: z.string(),
})
export type BodyDataConfigurationSchemaType = z.infer<typeof BodyDataConfigurationSchema>

export const SignatureConfigurationSchema = z.object({
  // ------ DIPLOMA BASICS FIELD ------
  signatureEnabled: z.boolean().optional(),
  signerTitle: z.string().optional(),
  signerSubline: z.string().optional(),
  signatureImage: ImageSchema.optional(),
})
export type SignatureConfigurationSchemaType = z.infer<typeof SignatureConfigurationSchema>

export const FooterConfigurationSchema = z.object({
  // ------ DIPLOMA BASICS FIELD ------
  footerEnabled: z.boolean().optional(),
  footerText: z.string().optional(),
})
export type FooterConfigurationSchemaType = z.infer<typeof FooterConfigurationSchema>

export const IssuerConfigurationSchema = z.object({
  // ------ DIPLOMA BASICS FIELD ------
  customIssuerEnabled: z.boolean().optional(),
  issuedByLabel: z.string().default('Issued by'),
  issuerAvatar: AvatarSchema.optional(),
  issuerTitle: z.string().max(25).optional(),
  issuerDescription: z.string().max(250).optional(),
})

export type IssuerConfigurationSchemaType = z.infer<typeof IssuerConfigurationSchema>

export const CreateThirdPartyModelSchema = z
  .object({
    // ------ UI BASICS FIELD ------
    name: z.string().max(28),
    description: LongTextSchema,
    badgeModelLogoUri: ImageSchema.optional(),
    textContrast: z.string().optional(),
    backgroundImage: z.string().optional(),
    template: z.nativeEnum(BadgeModelTemplate),
    // ------ STRATEGY FIELD ------
    mintFee: TokenInputSchema.default('0'),
    validFor: ExpirationTypeSchema,
    // administrators: ThirdPartyAdministratorsFields, // TODO ENABLE ONCE WE HAVE THE SUPPORT ON THE UI
    administrators: AddressSchema.optional(), // TODO REMOVE ONCE WE HAVE THE SUPPORT ON THE UI
  })
  .merge(BodyDataConfigurationSchema)
  .merge(IssuerConfigurationSchema)
  .merge(SignatureConfigurationSchema)
  .merge(FooterConfigurationSchema)
  .superRefine(refineDiploma)
  .superRefine(refineClassic)

export type CreateThirdPartyModelSchemaType = z.infer<typeof CreateThirdPartyModelSchema>

function refineClassic(data: any, ctx: RefinementCtx) {
  // Validate Diploma Template
  if (data.template !== BadgeModelTemplate.Badge) return
  if (!data.badgeModelLogoUri) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['badgeModelLogoUri'],
      message: 'Required',
    })
  }
  if (!data.textContrast) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['textContrast'],
      message: 'Required',
    })
  }
  if (!data.backgroundImage) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['backgroundImage'],
      message: 'Required',
    })
  }
}

function refineDiploma(data: any, ctx: RefinementCtx) {
  // Validate Diploma Template
  if (data.template !== BadgeModelTemplate.Diploma) return
  if (data.footerEnabled && !data.footerText) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['footerText'],
      message: 'You must add a text, if you enable the footer',
    })
  }
  if (!data.courseName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['courseName'],
      message: 'You must add a courseName',
    })
  }
  // if (!data.achievementDescription) {
  // TODO Add it later
  //   ctx.addIssue({
  //     code: z.ZodIssueCode.custom,
  //     path: ['achievementDescription'],
  //     message: 'You must add a achievementDescription',
  //   })
  // }
  if (!data.achievementDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['achievementDate'],
      message: 'You must add a achievementDate',
    })
  }
  if (data.signatureEnabled) {
    if (!data.signerTitle && !data.signatureImage && !data.signerSubline) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['signerTitle', 'signatureImage', 'signerSubline'],
        message: 'You must at least one config for the signature',
      })
    }
  }
}
