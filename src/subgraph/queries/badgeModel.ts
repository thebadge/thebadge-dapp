import gql from 'graphql-tag'

export const BADGE_MODELS = gql`
  query badgeModels {
    badgeModels {
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
