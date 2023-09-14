import { z } from 'zod'

import { AgreementSchema } from '@/src/components/form/helpers/customSchemas'

export const MintBadgeSchema = z.object({
  howItWorks: AgreementSchema,
  // Evidence object - go to form/helpers/validators.ts:71 if you want to know why a z.record
  evidence: z.record(z.string(), z.any()),
  // Badge Image on base64, generated from the badgePreview
  previewImage: z.string(),
})

export type MintBadgeSchemaType = z.infer<typeof MintBadgeSchema>
