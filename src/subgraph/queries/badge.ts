import gql from 'graphql-tag'

// TODO: hardcoded for kleros, fix it.
export const BADGES_IN_REVIEW = gql`
  query badgesInReview($date: BigInt!) {
    badges(where: { badgeKlerosMetaData_: { reviewDueDate_gt: $date }, status: Requested }) {
      ...BadgesInReview
    }
  }
`

export const BADGES_IN_REVIEW_AND_CHALLENGED = gql`
  query badgesInReviewAndChallenged($date: BigInt!) {
    badges(where: { badgeKlerosMetaData_: { reviewDueDate_gt: $date } }) {
      ...BadgesInReview
    }
  }
`

export const BADGES_IN_REVIEW_SMALL_SET = gql`
  query badgesInReviewSmallSet(
    $date: BigInt!
    $statuses: [BadgeStatus!]!
    $badgeReceiver: String!
  ) {
    badges(
      where: {
        badgeKlerosMetaData_: { reviewDueDate_gt: $date }
        status_in: $statuses
        account_starts_with: $badgeReceiver
      }
    ) {
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

export const BADGES_USER_CAN_REVIEW = gql`
  query badgesUserCanReview($userAddress: String!, $date: BigInt!) {
    badges(
      where: {
        badgeKlerosMetaData_: { reviewDueDate_gt: $date }
        status_in: [Requested, Challenged]
        account_not: $userAddress
      }
    ) {
      ...BadgesInReview
    }
  }
`

export const BADGES_USER_CAN_REVIEW_SMALL_SET = gql`
  query badgesUserCanReviewSmallSet(
    $userAddress: String!
    $date: BigInt!
    $statuses: [BadgeStatus!]!
    $badgeReceiver: String!
  ) {
    badges(
      where: {
        badgeKlerosMetaData_: { reviewDueDate_gt: $date }
        status_in: $statuses
        account_starts_with: $badgeReceiver
        account_not: $userAddress
      }
    ) {
      ...BadgeWithJustIds
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

export const BADGE_KLEROS_METADATA_BY_ID = gql`
  query badgeKlerosMetadataById($id: ID!) {
    badgeKlerosMetaData(id: $id) {
      ...BadgeKlerosMetadata
    }
  }
`

export const BADGE_BY_TYPE = gql`
  query badgeByModelId($id: String!) {
    badges(where: { badgeModel: $id }) {
      ...BadgeWithJustIds
    }
  }
`

export const BADGE_BY_USER_BY_MODEL_ID = gql`
  query userBadgeByModelId($userId: ID!, $modelId: String!) {
    user(id: $userId) {
      badges(where: { badgeModel: $modelId }) {
        id
        status
        createdAt
      }
    }
  }
`
