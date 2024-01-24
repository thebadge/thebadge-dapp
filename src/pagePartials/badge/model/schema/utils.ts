import { CreateCommunityModelSchema } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import {
  CreateThirdPartyBadgeModelSchema,
  CreateThirdPartyDiplomaModelSchema,
} from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import { BadgeModelControllerType, BadgeModelTemplate } from '@/types/badges/BadgeModel'

export function getZodSchema(
  controllerType: BadgeModelControllerType,
  template?: BadgeModelTemplate,
) {
  switch (controllerType.toLowerCase()) {
    case BadgeModelControllerType.Community.toLowerCase(): {
      return CreateCommunityModelSchema
    }
    case BadgeModelControllerType.ThirdParty.toLowerCase(): {
      switch (template) {
        case BadgeModelTemplate.Diploma: {
          return CreateThirdPartyDiplomaModelSchema
        }
        case BadgeModelTemplate.Badge:
        default: {
          return CreateThirdPartyBadgeModelSchema
        }
      }
    }
    default: {
      return CreateCommunityModelSchema
    }
  }
}
