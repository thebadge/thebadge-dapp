import gql from 'graphql-tag'

export const USER_BY_ID = gql`
  query userById($id: ID!) {
    user(id: $id) {
      ...User
    }
  }
`

export const USER_BY_ID_WITH_BADGES = gql`
  query userByIdWithBadges($id: ID!) {
    user(id: $id) {
      ...UserWithBadges
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
