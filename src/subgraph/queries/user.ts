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

export const MY_BADGE_TYPES = gql`
  query userBadges($ownerAddress: ID!) {
    user(id: $ownerAddress) {
      badges {
        id
        status
        reviewDueDate
        badgeType {
          validFor
          paused
          mintCost
          metadataURL
          id
          controllerName
          badgesMintedAmount
        }
      }
    }
  }
`

export const MY_CREATED_BADGE_TYPES = gql`
  query userCreatedBadges($ownerAddress: ID!) {
    user(id: $ownerAddress) {
      createdBadgeTypes {
        validFor
        paused
        mintCost
        metadataURL
        id
        controllerName
        badgesMintedAmount
      }
      createdBadgesTypesAmount
    }
  }
`
