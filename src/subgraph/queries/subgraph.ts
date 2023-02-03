import gql from 'graphql-tag'

export const SUBGRAPH_ERRORS = gql`
  query subgraphErrors {
    _meta {
      hasIndexingErrors
    }
  }
`
