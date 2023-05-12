import gql from 'graphql-tag'

export const BADGE_MODELS = gql`
  query badgeModels {
    badgeModels {
      ...BadgeModel
    }
  }
`

export const BADGE_Model = gql`
  query badgeModel($id: ID!) {
    badgeModel(id: $id) {
      id
      uri
      controllerType
      validFor
      creatorFee
      paused
      creator {
        id
        creatorUri
      }
      badgeModelKleros {
        registrationUri
        removalUri
        tcrList
        submissionBaseDeposit
        challengePeriodDuration
      }
    }
  }
`
