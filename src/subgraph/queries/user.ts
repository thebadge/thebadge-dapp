import gql from 'graphql-tag'

export const USER_BY_ID = gql`
  query userById($id: ID!) {
    user(id: $id) {
      id
      mintedBadgesAmount
      isVerified
      isCreator
      creatorUri
      badges {
        id
        badgeModel {
          id
          badgeModelKleros {
            registrationUri
            removalUri
            tcrList
            submissionBaseDeposit
            challengePeriodDuration
          }
        }
        badgeKlerosMetaData {
          reviewDueDate
        }
        uri
        status
      }
    }
  }
`

export const MY_BADGE_TYPES = gql`
  query userBadges($ownerAddress: ID!, $where: Badge_filter) {
    user(id: $ownerAddress) {
      badges(where: $where) {
        ...FullBadgeDetails
      }
    }
  }
`

export const MY_CREATED_BADGE_TYPES = gql`
  query userCreatedBadges($ownerAddress: ID!) {
    user(id: $ownerAddress) {
      createdBadgeModels {
        validFor
        paused
        uri
        id
        controllerType
        badgesMintedAmount
      }
      createdBadgesModelAmount
    }
  }
`

export const MY_BADGE_TYPES_IN_REVIEW = gql`
  query userBadgesInReview($ownerAddress: ID!) {
    user(id: $ownerAddress) {
      badges(where: { status_in: [Requested] }) {
        ...FullBadgeDetails
      }
    }
  }
`
