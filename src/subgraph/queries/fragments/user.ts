import gql from 'graphql-tag'

gql`
  fragment User on User {
    id
    statistics {
      mintedBadgesAmount
    }
    isVerified
    isCreator
    metadataUri
  }
`

gql`
  fragment UserWithBadges on User {
    id
    isVerified
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
