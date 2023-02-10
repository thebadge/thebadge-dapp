import gql from 'graphql-tag'

export const BADGE_TYPES = gql`
  query badgeTypes {
    badgeTypes {
      id
      metadataURL
      controllerName
      mintCost
      validFor
      paused
      badgesMintedAmount
      creator {
        id
        creatorMetadata
      }
      klerosBadge {
        klerosMetadataURL
        klerosTCRList
        badgesMintedAmount
        submissionBaseDeposit
        challengePeriodDuration
      }
    }
  }
`

export const BADGE_TYPE = gql`
  query badgeType($id: ID!) {
    badgeType(id: $id) {
      id
      metadataURL
      controllerName
      mintCost
      validFor
      paused
      creator {
        id
        creatorMetadata
      }
      klerosBadge {
        klerosMetadataURL
        klerosTCRList
        badgesMintedAmount
        submissionBaseDeposit
        challengePeriodDuration
      }
    }
  }
`

// export const EXAMPLE_QUERY_BY_ID = gql`
//   query exampleById($id: ID!) {
//     example(id: $id) {
//       id
//       proxyAddress
//     }
//   }
// `
// // where schema will be got from yarn schema script
// export const EXAMPLE_QUERY_WHERE = gql`
//   query exampleWhere($where: __Schema) {
//     example(where: $where) {
//       id
//       proxyAddress
//     }
//   }
// `
