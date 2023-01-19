import gql from 'graphql-tag'

export const SUBGRAPH_ERRORS = gql`
  query subgraphErrors {
    _meta {
      hasIndexingErrors
    }
  }
`
export const EMITTERS = gql`
  query emitters {
    emitters {
      id
      creator
      metadata
    }
  }
`

export const EMITTER = gql`
  query emitter($id: ID!) {
    emitter(id: $id) {
      id
      creator
      metadata
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
