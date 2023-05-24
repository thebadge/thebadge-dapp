import gql from 'graphql-tag'

gql`
  fragment FullBadgeDetails on Badge {
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
      creatorFee
      validFor
      badgesMintedAmount
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

gql`
  fragment BadgeKlerosMetadata on BadgeKlerosMetaData {
    id
    itemID
    reviewDueDate
    requests {
      ...Request
    }
  }
`
