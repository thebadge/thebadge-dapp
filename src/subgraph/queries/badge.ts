import gql from 'graphql-tag'

export const BADGE_TYPES = gql`
  query badgesInReview($date: BigInt!) {
    badges(where: { reviewDueDate_gt: $date }) {
      ...FullBadgeDetails
    }
  }
`

export const MY_BADGES = gql`
  query myBadges($wallet: BigInt!) {
    badges(where: { reviewDueDate_gt: $wallet }) {
      ...FullBadgeDetails
    }
  }
`
