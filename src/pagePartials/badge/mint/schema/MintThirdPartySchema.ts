import { z } from 'zod'

import {
  AddressSchema,
  AgreementSchema,
  EmailSchema,
} from '@/src/components/form/helpers/customSchemas'

export const MINT_THIRD_PARTY_METHODS = ['email', 'address'] as const

export const MintThirdPartySchema = z
  .object({
    // Step 0: terms and conditions
    terms: AgreementSchema,
    // Step 1: Mint params
    preferMintMethod: z.enum(MINT_THIRD_PARTY_METHODS).default('email'),
    destination: z.string(),
    // Badge Image on base64, generated from the badgePreview
    previewImage: z.string(),
    // Required data to complete some information on the image
    requiredData: z.record(z.string(), z.any()).optional(),
  })
  .superRefine(({ destination, preferMintMethod }, ctx) => {
    // Here we add the extra check to assert the field type when
    // preferMintMethod is configured.
    if (preferMintMethod === 'email' && !EmailSchema.safeParse(destination).success) {
      // If preferMintMethod is address, destination is required as type email
      ctx.addIssue({
        code: 'custom',
        message: 'Must be a valid email addresses.',
        path: ['destination'],
      })
    }
    if (preferMintMethod === 'address' && !AddressSchema.safeParse(destination).success) {
      // If preferMintMethod is address, destination is required as type address
      ctx.addIssue({
        code: 'custom',
        message: 'Address must be an valid Ethereum addresses.',
        path: ['destination'],
      })
    }
  })

export type MintThirdPartySchemaType = z.infer<typeof MintThirdPartySchema>
