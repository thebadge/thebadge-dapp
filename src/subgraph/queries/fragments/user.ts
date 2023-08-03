import gql from 'graphql-tag'

gql`
  fragment User on User {
    id
    statistics {
      mintedBadgesAmount
    }
    isVerified
    isCreator
    creatorUri
  }
`

gql`
  fragment UserWithBadges on User {
    id
    isVerified
    isCreator
    creatorUri
    badges {
      ...UserBadges
    }
    statistics {
      mintedBadgesAmount
    }
  }
`
