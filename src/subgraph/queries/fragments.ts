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
