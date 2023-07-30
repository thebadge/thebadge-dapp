import gql from 'graphql-tag'

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

gql`
  fragment BadgeKlerosMetadataWithBadge on BadgeKlerosMetaData {
    id
    itemID
    reviewDueDate
    requests {
      type
    }
    badge {
      id
      validUntil
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
