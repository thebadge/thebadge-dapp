import { z } from 'zod'

import { ImageSchema } from '@/src/components/form/helpers/customSchemas'
import { validateImageDimensions } from '@/src/pagePartials/badge/model/utils'

const MiniLogoCustomFieldsConfigurationSchema = z
  .object({
    miniLogoTitle: z.string().max(4).optional(),
    miniLogoSubTitle: z.string().max(10).optional(),
    miniLogoUrl: ImageSchema.refine(async (value) => {
      try {
        if (!value) {
          return true
        }
        // Asynchronously validate image dimensions (max 32x32)
        return await validateImageDimensions(value?.base64File, 32)
      } catch (error) {
        console.error('Error validating image dimensions:', error)
        return false
      }
    }, 'Max image dimensions are 32x32.'),
  })
  .optional()

export const CustomFieldsConfigurationSchema = z.object({
  // ------ BADGE BASICS FIELD ------
  customFieldsEnabled: z.boolean(),
  miniLogo: MiniLogoCustomFieldsConfigurationSchema,
})
export type CustomFieldsConfigurationSchemaType = z.infer<typeof CustomFieldsConfigurationSchema>
