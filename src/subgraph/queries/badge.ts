import gql from 'graphql-tag'

export const BADGES_IN_REVIEW = gql`
  query badgesInReview($date: BigInt!) {
    badges(where: { reviewDueDate_gt: $date }) {
      ...FullBadgeDetails
    }
  }
`

export const MY_BADGES = gql`
  query myBadges($wallet: String!) {
    badges(where: { receiver: $wallet }) {
      ...FullBadgeDetails
    }
  }
`

export const BADGE_BY_ID = gql`
  query badgeById($id: ID!) {
    badge(id: $id) {
      ...FullBadgeDetails
    }
  }
`

export const BADGE_BY_TYPE = gql`
  query badgeByTypeId($id: String!) {
    badges(where: { badgeType: $id }) {
      ...FullBadgeDetails
    }
  }
`
