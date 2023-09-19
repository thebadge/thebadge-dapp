import { z } from 'zod'

import { AddressSchema } from '@/src/components/form/helpers/customSchemas'

export const ClaimThirdPartyBadgeSchema = z.object({
  claimAddress: AddressSchema,
})

export type ClaimThirdPartyBadgeSchemaType = z.infer<typeof ClaimThirdPartyBadgeSchema>
