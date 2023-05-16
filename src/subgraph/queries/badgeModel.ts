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
      badgeModelKleros {
        ...KlerosBadgeModel
      }
    }
  }
`
