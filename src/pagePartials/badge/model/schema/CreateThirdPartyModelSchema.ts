import { z } from 'zod'

import {
  AddressSchema,
  AgreementSchema,
  ExpirationTypeSchema,
  ImageSchema,
  LongTextSchema,
  TokenInputSchema,
} from '@/src/components/form/helpers/customSchemas'

export const CreateThirdPartyModelSchema = z.object({
  howItWorks: AgreementSchema,
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

export type CreateThirdPartyModelSchemaType = z.infer<typeof CreateThirdPartyModelSchema>
