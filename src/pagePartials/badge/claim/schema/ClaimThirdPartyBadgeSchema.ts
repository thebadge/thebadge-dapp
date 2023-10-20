import { z } from 'zod'

import { AddressSchema } from '@/src/components/form/helpers/customSchemas'

export const ClaimThirdPartyBadgeSchema = z.object({
  claimAddress: AddressSchema,
  // Badge Image on base64, generated from the badgePreview
  previewImage: z.string(),
})

export type ClaimThirdPartyBadgeSchemaType = z.infer<typeof ClaimThirdPartyBadgeSchema>
