import gql from 'graphql-tag'

gql`
  fragment BadgeKlerosMetadata on BadgeKlerosMetaData {
    id
    itemID
    numberOfRequests
    reviewDueDate
    tcrStatus
    requests {
      ...Request
    }
  }
`

gql`
  fragment BadgeKlerosMetadataWithBadge on BadgeKlerosMetaData {
    ...BadgeKlerosMetadata
    badge {
      id
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
        badgeModelKleros {
          tcrList
          registrationUri
        }
      }
    }
  }
`
