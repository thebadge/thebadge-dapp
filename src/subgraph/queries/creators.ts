import gql from 'graphql-tag'

export const CREATORS = gql`
  query users {
    users(where: { isCreator: true }) {
      id
    }
  }
`

// export const EMITTERS = gql`
//   query emitters {
//     _meta {
//       hasIndexingErrors
//     }
//   }
// `

// export const EMITTER = gql`
//   query emitter($id: ID!) {
//     _meta {
//       hasIndexingErrors
//     }
//   }
// `

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
