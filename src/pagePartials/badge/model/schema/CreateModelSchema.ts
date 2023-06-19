import { z } from 'zod'

import {
  AgreementSchema,
  ChallengePeriodTypeSchema,
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
  criteriaFileUri: FileSchema,
  criteriaDeltaText: z.object({ string: z.string(), delta: z.any() }).optional(),
  challengePeriodDuration: ChallengePeriodTypeSchema,
  rigorousness: SeverityTypeSchema,
  mintCost: TokenInputSchema,
  validFor: ExpirationTypeSchema,
  // ------ EVIDENCE FORM FIELD ------
  badgeMetadataColumns: KlerosDynamicFields,
})

export type CreateModelSchemaType = z.infer<typeof CreateModelSchema>
