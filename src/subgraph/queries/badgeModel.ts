import gql from 'graphql-tag'

export const BADGE_MODELS_BY_CREATOR_ID = gql`
  query badgeModelByCreatorId($creatorId: String!) {
    badgeModels(orderBy: createdAt, orderDirection: desc, where: { creator: $creatorId }) {
      ...BadgeModel
    }
  }
`

export const THIRD_PARTY_BADGE_MODELS_BY_CREATOR_ID = gql`
  query thirdPartyBadgeModelByCreatorId($creatorId: String!) {
    badgeModels(
      orderBy: createdAt
      orderDirection: desc
      where: { controllerType: "thirdParty", creator: $creatorId }
    ) {
      ...BadgeModel
    }
  }
`

export const COMMUNITY_BADGE_MODELS = gql`
  query communityBadgeModels {
    badgeModels(
      orderBy: createdAt
      orderDirection: desc
      where: { controllerType_not: "thirdParty" }
    ) {
      ...BadgeModel
    }
  }
`

export const COMMUNITY_BADGE_MODELS_MAX_AMOUNT = gql`
  query communityBadgeModelsMaxAmount($first: Int!) {
    badgeModels(
      first: $first
      orderBy: createdAt
      orderDirection: desc
      where: { controllerType_not: "thirdParty" }
    ) {
      ...BadgeModel
    }
  }
`

export const BADGE_MODEL_BY_ID = gql`
  query badgeModelById($id: ID!) {
    badgeModel(id: $id) {
      ...BadgeModel
    }
  }
`

export const BADGE_MODEL_KLEROS_METADATA_BY_ID = gql`
  query badgeModelKlerosMetadataById($id: ID!) {
    badgeModelKlerosMetaData(id: $id) {
      ...BadgeModelKlerosMetadata
    }
  }
`

export const BADGE_MODEL_THIRD_PARTY_METADATA_BY_ID = gql`
  query badgeModelThirdPartyMetaDataById($id: ID!) {
    badgeModelThirdPartyMetaData(id: $id) {
      ...BadgeModelThirdPartyMetaData
    }
  }
`
