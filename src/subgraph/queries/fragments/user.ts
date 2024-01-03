import gql from 'graphql-tag'

gql`
  fragment User on User {
    id
    isCompany
    isCreator
    isCurator
    isRegistered
    metadataUri
    suspended
    statistics {
      mintedBadgesAmount
    }
  }
`

gql`
  fragment UserWithBadges on User {
    ...User
    badges {
      ...UserBadges
    }
  }
`
