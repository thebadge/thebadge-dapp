import { z } from 'zod'

import {
  ChallengePeriodTypeSchema,
  DeltaPDFSchema,
  ExpirationTypeSchema,
  FileSchema,
  ImageSchema,
  KlerosDynamicFields,
  LongTextSchema,
  SeverityTypeSchema,
  TokenInputSchema,
} from '@/src/components/form/helpers/customSchemas'
import { ModelsBackgroundsNames } from '@/src/constants/backgrounds'
import { CreatorRegisterSchema } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'

/**
 * Auxiliary schema to support the PDF upload or the PDF creation on the same form
 */
const CommunityBadgeModelCriteriaSchema = z
  .object({
    criteriaFileUri: FileSchema,
    criteriaDeltaText: DeltaPDFSchema,
  })
  .partial()
  .superRefine((data, ctx) => {
    if (!data.criteriaFileUri && !data.criteriaDeltaText) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['criteriaFileUri'],
        message: 'You must add a criteria, upload a PDF or write it down on the editor',
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['criteriaDeltaText'],
        message: 'You must add a criteria, upload a PDF or write it down on the editor',
      })
    }
  })

const MiniLogoCustomFieldsConfigurationSchema = z
  .object({
    miniLogoTitle: z.string().max(4).optional(),
    miniLogoSubTitle: z.string().max(10).optional(),
    miniLogoUrl: ImageSchema.optional(),
  })
  .optional()

/**
 * CustomFields on Badge Model used on Community and ThirdParty
 *
 * customFieldsEnabled: Boolean
 *
 * miniLogo: MiniLogoCustomFieldsConfigurationSchema
 */
export const CustomFieldsConfigurationSchema = z.object({
  // ------ BADGE BASICS FIELD ------
  customFieldsEnabled: z.boolean().optional(),
  miniLogo: MiniLogoCustomFieldsConfigurationSchema,
})
export type CustomFieldsConfigurationSchemaType = z.infer<typeof CustomFieldsConfigurationSchema>

/**
 * Default Community model configuration shared across all the templates
 *
 * name: String - Max 28 - Min 1
 *
 * description: LongTextSchema
 *
 * template - String (Not Implemented Yet)
 */
export const CommunityDefaultModelConfigurationSchema = z.object({
  name: z.string().max(28),
  description: LongTextSchema,
  template: z.string(),
})

export type CommunityDefaultModelConfigurationSchemaType = z.infer<
  typeof CommunityDefaultModelConfigurationSchema
>

/**
 * Default Community strategy configuration shared across all the templates
 *
 * criteria - CommunityBadgeModelCriteriaSchema
 *
 * challengePeriodDuration - ChallengePeriodTypeSchema
 *
 * rigorousness - SeverityTypeSchema
 *
 * mintFee - TokenInputSchema
 *
 * validFor - ExpirationTypeSchema
 */
export const CommunityStrategyModelConfigurationSchema = z.object({
  criteria: CommunityBadgeModelCriteriaSchema,
  challengePeriodDuration: ChallengePeriodTypeSchema,
  rigorousness: SeverityTypeSchema,
  mintFee: TokenInputSchema,
  validFor: ExpirationTypeSchema,
})
export type CommunityStrategyModelConfigurationSchemaType = z.infer<
  typeof CommunityStrategyModelConfigurationSchema
>

/**
 * UI Related for Badge Model on Community
 *
 * badgeModelLogoUri - ImageSchema
 *
 * textContrast - String
 *
 * backgroundImage - ModelsBackgroundsNames
 */
export const CommunityBadgeUIConfigurationSchema = z.object({
  // ------ UI BASICS FIELD ------
  badgeModelLogoUri: ImageSchema,
  textContrast: z.string(),
  backgroundImage: z.custom<ModelsBackgroundsNames>(),
})
export type CommunityBadgeUIConfigurationSchemaType = z.infer<
  typeof CommunityBadgeUIConfigurationSchema
>

export const CreateCommunityModelSchema = z
  .object({
    // ------ EVIDENCE FORM FIELD ------
    badgeMetadataColumns: KlerosDynamicFields,
  })
  .merge(CommunityDefaultModelConfigurationSchema)
  .merge(CommunityStrategyModelConfigurationSchema)
  .merge(CommunityBadgeUIConfigurationSchema)
  .merge(CustomFieldsConfigurationSchema)
  // ------ User register ------
  .merge(CreatorRegisterSchema)

export type BadgeModelCommunityCriteriaType = z.infer<typeof CommunityBadgeModelCriteriaSchema>
export type CreateCommunityModelSchemaType = z.infer<typeof CreateCommunityModelSchema>
