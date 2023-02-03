import gql from 'graphql-tag'

export const BADGE_TYPES = gql`
  query badgeTypes {
    badgeTypes(skip: 2) {
      # TODO: remove skip:2 after a new version of the contracts is deployed
      id
      metadataURL
      controllerName
      mintCost
      validFor
      paused
      emitter {
        metadata
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
