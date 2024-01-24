import dayjs from 'dayjs'
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
import { ModelsBackgroundsNames } from '@/src/constants/backgrounds'
import { CustomFieldsConfigurationSchema } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import { BadgeModelTemplate } from '@/types/badges/BadgeModel'

/**
 * Default ThirdParty model configuration shared across all the templates
 *
 * name: String - Max 28 - Min 1
 *
 * description: LongTextSchema
 *
 * template: NativeEnum - BadgeModelTemplate
 */
export const ThirdPartyDefaultModelConfigurationSchema = z.object({
  name: z.string().max(28).min(1),
  description: LongTextSchema,
  template: z.nativeEnum(BadgeModelTemplate),
})

export type ThirdPartyDefaultModelConfigurationSchemaType = z.infer<
  typeof ThirdPartyDefaultModelConfigurationSchema
>

/**
 * Default ThirdParty strategy configuration shared across all the templates
 *
 * mintFee: TokenInputSchema - Default 0
 *
 * validFor: ExpirationTypeSchema
 */
export const ThirdPartyStrategyModelConfigurationSchema = z.object({
  mintFee: TokenInputSchema.default('0'),
  validFor: ExpirationTypeSchema,
  // administrators: ThirdPartyAdministratorsFields, // TODO ENABLE ONCE WE HAVE THE SUPPORT ON THE UI
  administrators: AddressSchema.optional(), // TODO REMOVE ONCE WE HAVE THE SUPPORT ON THE UI
})
export type ThirdPartyStrategyModelConfigurationSchemaType = z.infer<
  typeof ThirdPartyStrategyModelConfigurationSchema
>

/********************* Badge *********************/

/**
 * UI Related for Badge Model on ThirdParty
 *
 * badgeModelLogoUri - ImageSchema
 *
 * textContrast - String
 *
 * backgroundImage - ModelsBackgroundsNames
 */
export const ThirdPartyBadgeUIConfigurationSchema = z.object({
  // ------ UI BASICS FIELD ------
  badgeModelLogoUri: ImageSchema,
  textContrast: z.string(),
  backgroundImage: z.custom<ModelsBackgroundsNames>(),
})
export type ThirdPartyBadgeUIConfigurationSchemaType = z.infer<
  typeof ThirdPartyBadgeUIConfigurationSchema
>

/********************* Diploma *********************/

/**
 * ThirdParty Diploma Body Configuration
 *
 * courseName - String
 * achievementDescription - String - Default: has successfully completed the course
 *
 * achievementDate - String - Default: MMMM D, YYYY
 */
export const BodyDataConfigurationSchema = z.object({
  // ------ DIPLOMA BASICS FIELD ------
  courseName: z.string(),
  achievementDescription: z.string().default('has successfully completed the course'),
  achievementDate: z.string().default(dayjs().format('MMMM D, YYYY')),
})
export type BodyDataConfigurationSchemaType = z.infer<typeof BodyDataConfigurationSchema>

/**
 * ThirdParty Diploma Signature Configuration
 *
 * signatureEnabled: Boolean
 *
 * signerTitle: String - Optional
 *
 * signerSubline: String - Optional
 *
 * signatureImage: ImageSchema - Optional
 */
export const SignatureConfigurationSchema = z.object({
  // ------ DIPLOMA BASICS FIELD ------
  signatureEnabled: z.boolean().optional(),
  signerTitle: z.string().optional(),
  signerSubline: z.string().optional(),
  signatureImage: ImageSchema.optional(),
})
export type SignatureConfigurationSchemaType = z.infer<typeof SignatureConfigurationSchema>

/**
 * ThirdParty Diploma Header Configuration
 *
 * headerLogo: ImageSchema - Optional
 */
export const HeaderConfigurationSchema = z.object({
  // ------ DIPLOMA BASICS FIELD ------
  headerLogo: ImageSchema.optional(),
})
export type HeaderConfigurationSchemaType = z.infer<typeof HeaderConfigurationSchema>

/**
 * ThirdParty Diploma Footer Configuration
 *
 * footerEnabled: Boolean
 *
 * footerText: String - Optional
 *
 * showDecoration: Boolean - Optional
 */
export const FooterConfigurationSchema = z.object({
  // ------ DIPLOMA BASICS FIELD ------
  footerEnabled: z.boolean().optional(),
  footerText: z.string().optional(),
  showDecoration: z.boolean().optional(), // Display "CERTIFICATE" word on the bottom
})
export type FooterConfigurationSchemaType = z.infer<typeof FooterConfigurationSchema>

/**
 * ThirdParty Diploma Issuer Configuration
 * customIssuerEnabled: Boolean
 *
 * issuedByLabel: String - Optional - Default: Issued by
 *
 * issuerAvatar: AvatarSchema - Optional
 *
 * issuerTitle: String - Optional - Max: 25
 *
 * issuerDescription: String - Optional - Max 250
 */
export const IssuerConfigurationSchema = z.object({
  // ------ DIPLOMA BASICS FIELD ------
  customIssuerEnabled: z.boolean().optional(),
  issuedByLabel: z.string().default('Issued by'),
  issuerAvatar: AvatarSchema.optional(),
  issuerTitle: z.string().max(25).optional(),
  issuerDescription: z.string().max(250).optional(),
})

export type IssuerConfigurationSchemaType = z.infer<typeof IssuerConfigurationSchema>

/**
 * Third Party Badge Model Creation Schema
 *
 */
export const CreateThirdPartyBadgeModelSchema = z
  .object({})
  .merge(ThirdPartyDefaultModelConfigurationSchema)
  .merge(ThirdPartyStrategyModelConfigurationSchema)
  .merge(ThirdPartyBadgeUIConfigurationSchema)
  .merge(CustomFieldsConfigurationSchema)
  .superRefine(refineClassic)

export type CreateThirdPartyBadgeModelSchemaType = z.infer<typeof CreateThirdPartyBadgeModelSchema>

function refineClassic(data: any, ctx: RefinementCtx) {
  // Validate Diploma Template
  if (data.template !== BadgeModelTemplate.Badge) return
  if (!data.badgeModelLogoUri) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['badgeModelLogoUri'],
      message: 'An Image or a Logo is required',
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
  if (data.customFieldsEnabled) {
    if (!data.miniLogo.miniLogoTitle && !data.miniLogo.miniLogoUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['miniLogo.miniLogoTitle'],
        message: 'Mini Logo title is required',
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['miniLogo.miniLogoUrl'],
        message: 'Mini Logo image is required',
      })
    }
  }
}

/**
 * Third Party Diploma Model Creation Schema
 *
 */
export const CreateThirdPartyDiplomaModelSchema = z
  .object({})
  .merge(ThirdPartyDefaultModelConfigurationSchema)
  .merge(ThirdPartyStrategyModelConfigurationSchema)
  .merge(BodyDataConfigurationSchema)
  .merge(IssuerConfigurationSchema)
  .merge(SignatureConfigurationSchema)
  .merge(FooterConfigurationSchema)
  .merge(HeaderConfigurationSchema)
  .merge(CustomFieldsConfigurationSchema)
  .superRefine(refineDiploma)

export type CreateThirdPartyDiplomaModelSchemaType = z.infer<
  typeof CreateThirdPartyDiplomaModelSchema
>

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
