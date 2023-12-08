import { z } from 'zod'

import {
  AgreementSchema,
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

export const CreateCommunityModelSchema = z.object({
  howItWorks: AgreementSchema,
  // ------ UI BASICS FIELD ------
  name: z.string().max(28),
  description: LongTextSchema,
  badgeModelLogoUri: ImageSchema,
  textContrast: z.string(),
  backgroundImage: z.string(),
  template: z.string(),
  // ------ STRATEGY FIELD ------
  criteria: CommunityBadgeModelCriteriaSchema,
  challengePeriodDuration: ChallengePeriodTypeSchema,
  rigorousness: SeverityTypeSchema,
  mintFee: TokenInputSchema,
  validFor: ExpirationTypeSchema,
  // ------ EVIDENCE FORM FIELD ------
  badgeMetadataColumns: KlerosDynamicFields,
})

export type BadgeModelCommunityCriteriaType = z.infer<typeof CommunityBadgeModelCriteriaSchema>
export type CreateCommunityModelSchemaType = z.infer<typeof CreateCommunityModelSchema>

export const CustomFieldsConfigurationSchema = z.object({
  // ------ BADGE BASICS FIELD ------
  customFieldsEnabled: z.boolean().optional(),
  badgeTitle: z.string().optional(),
  badgeDescription: z.string().optional(),
})
export type CustomFieldsConfigurationSchemaType = z.infer<typeof CustomFieldsConfigurationSchema>
