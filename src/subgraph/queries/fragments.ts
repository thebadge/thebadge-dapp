import gql from 'graphql-tag'

gql`
  fragment FullBadgeDetails on Badge {
    id
    evidenceMetadataUrl
    reviewDueDate
    reviewDueDate
    status
    isChallenged
    receiver {
      id
    }
    badgeType {
      id
      metadataURL
      mintCost
      validFor
      badgesMintedAmount
      klerosBadge {
        klerosMetadataURL
        klerosTCRList
        submissionBaseDeposit
        challengePeriodDuration
      }
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
    isChallenged
    evidenceMetadataUrl
    receiver {
      id
    }
    badgeType {
      id
      metadataURL
      klerosBadge {
        klerosMetadataURL
      }
    }
  }
`
