import gql from 'graphql-tag'

gql`
  fragment FullBadgeDetails on Badge {
    id
    status
    uri
    validFor
    account {
      id
    }
    badgeModel {
      id
      uri
      controllerType
      creatorFee
      validFor
      badgesMintedAmount
    }
  }
`

gql`
  fragment BadgesInReview on Badge {
    id
    status
    uri
    account {
      id
    }
    badgeModel {
      id
      uri
      controllerType
      validFor
      badgeModelKleros {
        challengePeriodDuration
      }
    }
    badgeKlerosMetaData {
      reviewDueDate
    }
  }
`

/**
 * Small fragment to use on the explorer, to search and list all the badges in review,
 * Fetching an small amount of data speed up a little bit the time to render the list
 */

gql`
  fragment BadgeWithJustIds on Badge {
    id
    status
    uri
    account {
      id
    }
    badgeModel {
      id
      uri
      badgeModelKleros {
        tcrList
        registrationUri
      }
    }
  }
`

gql`
  fragment UserBadges on Badge {
    id
    uri
    status
    badgeModel {
      id
    }
    badgeKlerosMetaData {
      reviewDueDate
    }
  }
`
