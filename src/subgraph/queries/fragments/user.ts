import gql from 'graphql-tag'

gql`
  fragment User on User {
    id
    mintedBadgesAmount
    isVerified
    isCreator
    creatorUri
  }
`

gql`
  fragment UserWithBadges on User {
    id
    mintedBadgesAmount
    isVerified
    isCreator
    creatorUri
    badges {
      ...UserBadges
    }
  }
`
