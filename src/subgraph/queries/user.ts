import gql from 'graphql-tag'

export const USER_BY_ID = gql`
  query userById($id: ID!) {
    user(id: $id) {
      id
      mintedBadgesAmount
      isVerified
      isCreator
      creatorMetadata
      badges {
        id
        badgeType {
          id
          klerosBadge {
            klerosMetadataURL
            klerosTCRList
            submissionBaseDeposit
            challengePeriodDuration
          }
        }
        evidenceMetadataUrl
        status
        reviewDueDate
      }
    }
  }
`
