import gql from 'graphql-tag'

gql`
  fragment FullBadgeDetails on Badge {
    id
    status
    uri
    validUntil
    createdTxHash
    claimedTxHash
    createdAt
    claimedAt
    contractAddress
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
      contractAddress
      createdTxHash
      badgeModelKleros {
        tcrList
        challengePeriodDuration
      }
      creator {
        id
        metadataUri
      }
    }
    badgeKlerosMetaData {
      reviewDueDate
    }
  }
`

gql`
  fragment BadgesInReview on Badge {
    id
    status
    uri
    createdTxHash
    claimedTxHash
    createdAt
    claimedAt
    contractAddress
    account {
      id
    }
    badgeModel {
      id
      uri
      controllerType
      validFor
      contractAddress
      createdTxHash
      badgeModelKleros {
        tcrList
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
    createdTxHash
    claimedTxHash
    createdAt
    claimedAt
    contractAddress
    account {
      id
    }
    badgeModel {
      id
      uri
      contractAddress
      controllerType
      badgeModelKleros {
        tcrList
        registrationUri
      }
    }
    badgeKlerosMetaData {
      reviewDueDate
    }
  }
`

gql`
  fragment UserBadges on Badge {
    id
    uri
    status
    contractAddress
    createdTxHash
    claimedTxHash
    createdAt
    claimedAt
    badgeModel {
      id
      contractAddress
    }
    badgeKlerosMetaData {
      reviewDueDate
    }
  }
`
