import gql from 'graphql-tag'

gql`
  fragment User on User {
    id
    statistics {
      mintedBadgesAmount
    }
    isCreator
    isRegistered
    metadataUri
  }
`

gql`
  fragment UserWithBadges on User {
    id
    isCreator
    metadataUri
    badges {
      ...UserBadges
    }
    statistics {
      mintedBadgesAmount
    }
  }
`
