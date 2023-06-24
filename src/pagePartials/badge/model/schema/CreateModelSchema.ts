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

export const CreateModelSchema = z.object({
  howItWorks: AgreementSchema,
  // ------ UI BASICS FIELD ------
  name: z.string().max(28),
  description: LongTextSchema,
  badgeModelLogoUri: ImageSchema,
  textContrast: z.string(),
  backgroundImage: z.string(),
  template: z.string(),
  // ------ STRATEGY FIELD ------
  criteria: z
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
    }),
  challengePeriodDuration: ChallengePeriodTypeSchema,
  rigorousness: SeverityTypeSchema,
  mintCost: TokenInputSchema,
  validFor: ExpirationTypeSchema,
  // ------ EVIDENCE FORM FIELD ------
  badgeMetadataColumns: KlerosDynamicFields,
})

export type CreateModelSchemaType = z.infer<typeof CreateModelSchema>
