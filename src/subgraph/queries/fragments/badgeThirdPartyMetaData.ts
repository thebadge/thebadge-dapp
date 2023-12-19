import gql from 'graphql-tag'

gql`
  fragment BadgeThirdPartyMetadata on BadgeThirdPartyMetaData {
    id
    badgeDataUri
  }
`
