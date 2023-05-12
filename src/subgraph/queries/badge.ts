import gql from 'graphql-tag'

// TODO: hardcoded for kleros, fix it.
export const BADGES_IN_REVIEW = gql`
  query badgesInReview($date: BigInt!) {
    badges(where: { badgeKlerosMetadata_: { reviewDueDate_gt: $date } }) {
      ...FullBadgeDetails
    }
  }
`

export const BADGES_IN_REVIEW_SMALL_SET = gql`
  query badgesInReviewSmallSet($date: BigInt!) {
    badges(where: { badgeKlerosMetadata_: { reviewDueDate_gt: $date } }) {
      ...BadgeWithJustIds
    }
  }
`

export const MY_BADGES = gql`
  query myBadges($wallet: String!) {
    badges(where: { account: $wallet }) {
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
    badges(where: { badgeModel: $id }) {
      ...BadgeWithJustIds
    }
  }
`
