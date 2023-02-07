import gql from 'graphql-tag'

export const USER_BY_ID = gql`
  query userById($id: ID!) {
    user(id: $id) {
      id
      badges {
        id
        badgeType {
          id
        }
        evidenceMetadataUrl
        status
        reviewDueDate
      }
      mintedBadgesAmount
      isVerified
      isCreator
      creatorMetadata
    }
  }
`
