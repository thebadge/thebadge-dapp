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
      ...Request
    }
    badge {
      id
      validFor
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
