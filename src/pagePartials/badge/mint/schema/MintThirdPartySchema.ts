import { z } from 'zod'

import {
  AddressSchemaThirdParty,
  AgreementSchema,
  EmailSchemaThirdParty,
} from '@/src/components/form/helpers/customSchemas'

export const MINT_THIRD_PARTY_METHODS = ['email', 'address'] as const

export const MintThirdPartySchema = z
  .object({
    // Step 0: terms and conditions
    terms: AgreementSchema,
    // Step 1: Mint params
    preferMintMethod: z.enum(MINT_THIRD_PARTY_METHODS),
    email: EmailSchemaThirdParty,
    address: AddressSchemaThirdParty,
    // Badge Image on base64, generated from the badgePreview
    previewImage: z.string(),
  })
  .refine((data) => {
    const { address, email, preferMintMethod } = data
    if (preferMintMethod === 'email') {
      // If preferMintMethod is email, make email required and address optional
      return !!email
    } else if (preferMintMethod === 'address') {
      // If preferMintMethod is address, make address required and email optional
      return !!address
    }
    return false // Unrecognized value for preferMintMethod
  })

export type MintThirdPartySchemaType = z.infer<typeof MintThirdPartySchema>
